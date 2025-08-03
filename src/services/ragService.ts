import { DocumentChunk, ChatMessage, EvaluationMetrics } from "../types";
import { embeddingService } from "./embeddingService";

class RAGService {
  private documents: DocumentChunk[] = [];
  private metrics: EvaluationMetrics = {
    retrievalAccuracy: 0,
    responseLatency: 0,
    documentProcessingTime: 0,
    ocrAccuracy: 0,
    totalDocuments: 0,
    totalQueries: 0,
  };

  addDocumentChunks(chunks: DocumentChunk[]) {
    this.documents.push(...chunks);
    this.metrics.totalDocuments++;
  }

  async query(
    question: string,
    topK: number = 5
  ): Promise<{
    answer: string;
    relevantChunks: DocumentChunk[];
    confidence: number;
    responseTime: number;
  }> {
    const startTime = Date.now();

    try {
      // Generate embedding for the question
      const questionEmbedding = await embeddingService.generateEmbedding(
        question
      );

      // Retrieve relevant chunks
      const relevantChunks = await this.retrieveRelevantChunks(
        questionEmbedding,
        topK
      );

      // Generate answer using the retrieved context
      const answer = await this.generateAnswer(question, relevantChunks);

      const responseTime = Date.now() - startTime;
      this.metrics.totalQueries++;
      this.metrics.responseLatency =
        (this.metrics.responseLatency + responseTime) / 2;

      return {
        answer,
        relevantChunks,
        confidence: this.calculateConfidence(relevantChunks),
        responseTime,
      };
    } catch (error) {
      console.error("Query processing failed:", error);
      throw error;
    }
  }

  private async retrieveRelevantChunks(
    questionEmbedding: number[],
    topK: number
  ): Promise<DocumentChunk[]> {
    const similarities: { chunk: DocumentChunk; similarity: number }[] = [];

    for (const chunk of this.documents) {
      if (!chunk.metadata.embedding) continue;

      const similarity = embeddingService.calculateSimilarity(
        questionEmbedding,
        chunk.metadata.embedding
      );

      similarities.push({ chunk, similarity });
    }

    // Sort by similarity and return top K
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topK).map((item) => item.chunk);
  }

  private async generateAnswer(
    question: string,
    relevantChunks: DocumentChunk[]
  ): Promise<string> {
    // Create context from relevant chunks
    const context = relevantChunks
      .map((chunk) => `Source: ${chunk.sourceFile}\nContent: ${chunk.content}`)
      .join("\n\n---\n\n");

    // Simple answer generation (in production, you'd use OpenAI API or similar)
    if (relevantChunks.length === 0) {
      return "I couldn't find relevant information in the uploaded documents to answer your question. Please try rephrasing your query or upload more relevant documents.";
    }

    // Generate a contextual answer based on retrieved chunks
    const answer = this.createContextualAnswer(
      question,
      context,
      relevantChunks
    );
    return answer;
  }

  private createContextualAnswer(
    question: string,
    context: string,
    chunks: DocumentChunk[]
  ): string {
    // Enhanced answer generation logic
    const questionLower = question.toLowerCase();
    const contextLower = context.toLowerCase();

    // Check if chunks contain meaningful content
    const meaningfulChunks = chunks.filter(
      (chunk) =>
        chunk.content.length > 20 &&
        /[a-zA-Z]/.test(chunk.content) &&
        !chunk.content.includes("No readable text could be extracted")
    );

    if (meaningfulChunks.length === 0) {
      return (
        "I was unable to extract readable text from the uploaded documents. Please try:\n\n" +
        "• Uploading the document as a high-quality image (JPG/PNG)\n" +
        "• Ensuring the document is clear and not corrupted\n" +
        "• Using a different file format if possible\n\n" +
        "The system works best with clear, high-resolution documents."
      );
    }

    let answer = "Based on the uploaded documents:\n\n";

    // Find the most relevant meaningful chunk
    const mostRelevant = meaningfulChunks[0];
    if (mostRelevant) {
      // Clean up the content for better readability
      const cleanContent = this.cleanChunkContent(mostRelevant.content);
      answer += `From ${mostRelevant.sourceFile}:\n"${cleanContent}"\n\n`;
    }

    // Add information from other relevant meaningful chunks
    if (meaningfulChunks.length > 1) {
      answer += "Additional relevant information:\n";
      meaningfulChunks.slice(1, 3).forEach((chunk) => {
        const cleanContent = this.cleanChunkContent(chunk.content);
        const preview =
          cleanContent.length > 100
            ? cleanContent.substring(0, 100) + "..."
            : cleanContent;
        answer += `• ${preview}\n`;
      });
    }

    // Add source information
    answer += `\n*Retrieved from ${meaningfulChunks.length} relevant document section(s)*`;

    // Add helpful suggestions if content seems limited
    if (meaningfulChunks.length < 2) {
      answer +=
        "\n\n*Note: Limited content was extracted. For better results, try uploading clearer documents or images.*";
    }

    return answer;
  }

  private cleanChunkContent(content: string): string {
    // Remove excessive whitespace and clean up formatting
    return content
      .replace(/\s+/g, " ")
      .replace(/[^\w\s.,!?;:()\-]/g, "")
      .trim();
  }

  private calculateConfidence(chunks: DocumentChunk[]): number {
    if (chunks.length === 0) return 0;

    const avgConfidence =
      chunks.reduce((sum, chunk) => {
        return sum + (chunk.metadata.confidence || 0.8);
      }, 0) / chunks.length;

    return Math.min(avgConfidence, 1.0);
  }

  getMetrics(): EvaluationMetrics {
    return { ...this.metrics };
  }

  clearDocuments() {
    this.documents = [];
    this.metrics.totalDocuments = 0;
  }
}

export const ragService = new RAGService();
