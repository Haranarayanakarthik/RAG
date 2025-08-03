class EmbeddingService {
  private cache = new Map<string, number[]>();

  async generateEmbedding(text: string): Promise<number[]> {
    // Check cache first
    if (this.cache.has(text)) {
      return this.cache.get(text)!;
    }

    try {
      // Use a simple TF-IDF-like approach for embeddings (simplified)
      const embedding = this.createSimpleEmbedding(text);
      this.cache.set(text, embedding);
      return embedding;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      // Return a random embedding as fallback
      return Array.from({ length: 384 }, () => Math.random() - 0.5);
    }
  }

  private createSimpleEmbedding(text: string): number[] {
    // Simplified embedding generation using character frequencies and patterns
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
    // Use word hashing and frequency for embedding generation
    words.forEach((word) => {
      const hash = this.simpleHash(word);
      const position = Math.abs(hash) % 384;
      embedding[position] += 1 / (words.length + 1);
    });
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    const magnitude1 = Math.sqrt(norm1);
    const magnitude2 = Math.sqrt(norm2);
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  }
}

export const embeddingService = new EmbeddingService();