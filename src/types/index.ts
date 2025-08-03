export interface DocumentChunk {
  id: string;
  content: string;
  type: "text" | "table" | "image" | "chart";
  sourceFile: string;
  page?: number;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
    embedding?: number[];
  };
  metadata: {
    confidence?: number;
    extractedAt: string;
    processingTime?: number;
  };
}

export interface ProcessedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  chunks: DocumentChunk[];
  extractedText: string;
  tables: any[];
  images: string[];
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  uploadedAt: string;
  processedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relevantChunks?: DocumentChunk[];
  confidence?: number;
}

export interface EvaluationMetrics {
  retrievalAccuracy: number;
  responseLatency: number;
  documentProcessingTime: number;
  ocrAccuracy: number;
  totalDocuments: number;
  totalQueries: number;
}