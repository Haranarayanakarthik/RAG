import { DocumentChunk, ProcessedDocument } from "../types";
import { ocrService } from "./ocrService";
import { embeddingService } from "./embeddingService";

class DocumentProcessor {
  async processDocument(file: File): Promise<ProcessedDocument> {
    const startTime = Date.now();

    const document: ProcessedDocument = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      chunks: [],
      extractedText: "",
      tables: [],
      images: [],
      processingStatus: "processing",
      uploadedAt: new Date().toISOString(),
    };

    try {
      if (file.type === "application/pdf") {
        await this.processPDF(file, document);
      } else if (file.type.startsWith("image/")) {
        await this.processImage(file, document);
      }

      // Generate embeddings for all chunks
      for (const chunk of document.chunks) {
        chunk.metadata.embedding = await embeddingService.generateEmbedding(
          chunk.content
        );
      }

      document.processingStatus = "completed";
      document.processedAt = new Date().toISOString();

      const processingTime = Date.now() - startTime;
      document.chunks.forEach((chunk) => {
        chunk.metadata.processingTime = processingTime;
      });
    } catch (error) {
      console.error("Document processing failed:", error);
      document.processingStatus = "error";
    }

    return document;
  }

  private async processPDF(file: File, document: ProcessedDocument) {
    try {
      // Convert PDF to images and use OCR for better text extraction
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Create a temporary image from PDF for OCR processing
      const imageUrl = URL.createObjectURL(file);

      // For now, we'll use a more robust text extraction approach
      // In a real implementation, you'd use PDF.js or similar
      const arrayBuffer = await file.arrayBuffer();
      const text = await this.extractTextFromPDFBuffer(arrayBuffer);

      if (text && text.length > 10) {
        document.extractedText = text;
        const chunks = this.createTextChunks(text, document.name);
        document.chunks.push(...chunks);
      } else {
        // Fallback to OCR if direct text extraction fails
        await this.processImageFromPDF(file, document);
      }
    } catch (error) {
      console.error("PDF processing failed, trying OCR fallback:", error);
      await this.processImageFromPDF(file, document);
    }
  }

  private async processImageFromPDF(file: File, document: ProcessedDocument) {
    try {
      // Convert PDF to image for OCR
      const { text, confidence } = await ocrService.extractTextFromImage(file);

      if (text && text.length > 10) {
        document.extractedText = text;
        const chunks = this.createTextChunks(text, document.name, confidence);
        document.chunks.push(...chunks);
      }
    } catch (error) {
      console.error("OCR fallback failed:", error);
      // Create a basic document structure even if text extraction fails
      document.extractedText =
        "Document uploaded successfully, but text extraction encountered issues. Please try uploading the document as an image (JPG/PNG) for better OCR results.";
      const chunks = this.createTextChunks(
        document.extractedText,
        document.name,
        0.5
      );
      document.chunks.push(...chunks);
    }
  }

  private async extractTextFromPDFBuffer(
    arrayBuffer: ArrayBuffer
  ): Promise<string> {
    // Simple PDF text extraction - look for readable text patterns
    const uint8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder("utf-8", { fatal: false });
    let text = decoder.decode(uint8Array);

    // Clean up the extracted text
    text = this.cleanExtractedText(text);

    // If the text is mostly garbage, return empty string to trigger OCR fallback
    if (this.isTextGarbled(text)) {
      return "";
    }

    return text;
  }

  private cleanExtractedText(text: string): string {
    // Remove PDF metadata and control characters
    text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, " ");

    // Remove PDF-specific patterns
    text = text.replace(/\/[A-Za-z]+\s+/g, " ");
    text = text.replace(/\d+\s+\d+\s+obj/g, " ");
    text = text.replace(/endobj/g, " ");
    text = text.replace(/stream[\s\S]*?endstream/g, " ");

    // Clean up whitespace
    text = text.replace(/\s+/g, " ").trim();

    // Extract sentences that look like readable text
    const sentences = text.split(/[.!?]+/).filter((sentence) => {
      const cleaned = sentence.trim();
      return (
        cleaned.length > 10 &&
        /[a-zA-Z]/.test(cleaned) &&
        cleaned.split(" ").length > 2
      );
    });

    return sentences.join(". ").trim();
  }

  private isTextGarbled(text: string): boolean {
    if (!text || text.length < 10) return true;

    // Check for high ratio of special characters
    const specialChars = text.match(/[^a-zA-Z0-9\s.,!?;:()\-]/g) || [];
    const specialRatio = specialChars.length / text.length;

    // Check for readable words
    const words = text.split(/\s+/);
    const readableWords = words.filter(
      (word) => word.length > 2 && /^[a-zA-Z]+$/.test(word)
    );
    const readableRatio = readableWords.length / words.length;

    return specialRatio > 0.3 || readableRatio < 0.3;
  }

  private async processImage(file: File, document: ProcessedDocument) {
    try {
      const { text, confidence } = await ocrService.extractTextFromImage(file);
      document.extractedText = text;

      // Create image URL for preview
      const imageUrl = URL.createObjectURL(file);
      document.images.push(imageUrl);

      // Create chunks from OCR text
      const chunks = this.createTextChunks(text, document.name, confidence);
      document.chunks.push(...chunks);

      // Detect tables and charts (simplified)
      const tables = this.detectTables(text);
      document.tables.push(...tables);
    } catch (error) {
      console.error("Image processing failed:", error);
      throw error;
    }
  }

  private createTextChunks(
    text: string,
    sourceFile: string,
    confidence?: number
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];

    if (!text || text.length < 10) {
      return [
        {
          id: crypto.randomUUID(),
          content:
            "No readable text could be extracted from this document. Please ensure the document is clear and try uploading it as a high-quality image.",
          type: "text",
          sourceFile,
          metadata: {
            confidence: 0.1,
            extractedAt: new Date().toISOString(),
          },
        },
      ];
    }

    // Split into sentences and create meaningful chunks
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);

    if (sentences.length === 0) {
      // If no sentences found, create chunks by paragraphs or lines
      const lines = text.split("\n").filter((line) => line.trim().length > 10);
      for (let i = 0; i < lines.length; i += 3) {
        const chunkText = lines
          .slice(i, i + 3)
          .join("\n")
          .trim();
        if (chunkText.length > 0) {
          chunks.push({
            id: crypto.randomUUID(),
            content: chunkText,
            type: "text",
            sourceFile,
            metadata: {
              confidence,
              extractedAt: new Date().toISOString(),
            },
          });
        }
      }
    } else {
      // Create overlapping chunks of ~3 sentences
      for (let i = 0; i < sentences.length; i += 2) {
        const chunkText = sentences
          .slice(i, i + 3)
          .join(". ")
          .trim();
        if (chunkText.length > 0) {
          chunks.push({
            id: crypto.randomUUID(),
            content: chunkText + ".",
            type: "text",
            sourceFile,
            metadata: {
              confidence,
              extractedAt: new Date().toISOString(),
            },
          });
        }
      }
    }

    return chunks.length > 0
      ? chunks
      : [
          {
            id: crypto.randomUUID(),
            content: text.substring(0, 500) + (text.length > 500 ? "..." : ""),
            type: "text",
            sourceFile,
            metadata: {
              confidence,
              extractedAt: new Date().toISOString(),
            },
          },
        ];
  }

  private detectTables(text: string): any[] {
    const tables: any[] = [];

    // Simple table detection based on common patterns
    const lines = text.split("\n");
    let currentTable: string[] = [];

    for (const line of lines) {
      // Look for lines with multiple spaces or tabs (table-like structure)
      if (
        line.includes("\t") ||
        /\s{3,}/.test(line) ||
        /\d+.*\d+.*\d+/.test(line)
      ) {
        currentTable.push(line);
      } else if (currentTable.length > 0) {
        if (currentTable.length >= 2) {
          tables.push({
            id: crypto.randomUUID(),
            rows: currentTable,
            type: "detected_table",
          });
        }
        currentTable = [];
      }
    }

    // Don't forget the last table
    if (currentTable.length >= 2) {
      tables.push({
        id: crypto.randomUUID(),
        rows: currentTable,
        type: "detected_table",
      });
    }

    return tables;
  }
}

export const documentProcessor = new DocumentProcessor();
