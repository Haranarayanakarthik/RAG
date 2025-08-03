# VisualRAG - Document Analysis System

A comprehensive Visual Document Analysis RAG (Retrieval-Augmented Generation) system that processes PDFs, images, and scanned documents to enable intelligent querying and information extraction.

## 🎯 Features

### Multi-Format Document Support
- **PDF Processing**: Extract text, tables, and structure from PDF documents
- **Image Analysis**: Process JPG, PNG, and other image formats
- **OCR Integration**: Extract text from scanned documents and images using Tesseract.js
- **Table Detection**: Identify and extract tabular data from documents

### Advanced RAG Pipeline
- **Intelligent Chunking**: Context-aware document segmentation
- **Vector Embeddings**: Semantic similarity search for relevant content retrieval
- **Query Processing**: Natural language question answering
- **Source Attribution**: Track and display document sources for answers

### Professional UI/UX
- **Drag & Drop Upload**: Intuitive file upload interface
- **Real-time Processing**: Live status updates during document processing
- **Interactive Chat**: Conversational interface for document querying
- **Metrics Dashboard**: Performance monitoring and evaluation metrics

## 🏥 Domain Focus

This system is optimized for **healthcare document analysis**, including:
- Medical reports and test results
- Research papers and clinical studies
- Patient documentation and charts
- Medical imaging reports with text overlays

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visual-rag-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### 1. Upload Documents
- Drag and drop PDF files, images, or scanned documents
- Supported formats: PDF, JPG, PNG
- Maximum file size: 50MB per file
- Multiple files can be uploaded simultaneously

### 2. Document Processing
- OCR automatically extracts text from images and scanned documents
- Tables and structured data are detected and parsed
- Content is chunked and indexed for optimal retrieval

### 3. Query Documents
- Use the chat interface to ask questions about uploaded documents
- Examples:
  - "What are the key findings in this medical report?"
  - "Summarize the test results from the lab documents"
  - "What medications are mentioned in the patient files?"

### 4. Review Results
- Answers include source attribution and confidence scores
- Relevant document chunks are highlighted
- Performance metrics are displayed in real-time

## 🛠 Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for consistent iconography
- **React Dropzone** for file upload handling

### Document Processing
- **Tesseract.js** for browser-based OCR
- **Custom PDF processing** for text extraction
- **Table detection algorithms** for structured data
- **Image preprocessing** for enhanced OCR accuracy

### RAG Implementation
- **Vector embeddings** using custom similarity algorithms
- **Semantic chunking** for optimal content retrieval
- **Context-aware generation** for accurate answers
- **Relevance scoring** for result ranking

### Performance Features
- **Lazy loading** for large documents
- **Caching** for processed embeddings
- **Asynchronous processing** for responsive UI
- **Memory optimization** for browser efficiency

## 📊 Evaluation Metrics

The system tracks several key performance indicators:

- **Retrieval Accuracy**: Measure of relevant content retrieval
- **Response Latency**: Time taken to process queries
- **OCR Accuracy**: Text extraction quality from images
- **Document Processing Time**: Time to process uploaded files
- **System Throughput**: Number of documents and queries processed

## 🔧 Configuration

### OCR Settings
OCR is configured for optimal healthcare document processing:
- Language: English (configurable)
- Confidence threshold: 80%
- Image preprocessing for enhanced accuracy

### Chunking Strategy
Documents are segmented using:
- Sentence-based chunking with overlap
- Context preservation for tables and charts
- Metadata retention for source attribution

### Embedding Model
Uses a lightweight embedding approach suitable for browser environments:
- 384-dimensional vectors
- Cosine similarity for relevance scoring
- Local caching for performance

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify
# The dist/ folder contains the built application
```

### Environment Variables
No external API keys required for basic functionality. For enhanced features:
- `VITE_OPENAI_API_KEY`: For advanced embeddings (optional)
- `VITE_ANALYTICS_ID`: For usage analytics (optional)

## 🧪 Testing & Quality Assurance

### Manual Testing Checklist
- [ ] Upload various document types (PDF, images, scanned docs)
- [ ] Verify OCR accuracy on different image qualities
- [ ] Test query relevance and answer quality
- [ ] Check responsive design on different screen sizes
- [ ] Validate error handling for unsupported files

### Performance Benchmarks
- Document processing: < 5 seconds for typical files
- Query response time: < 2 seconds
- OCR accuracy: > 90% for clear text
- Memory usage: Optimized for browser environments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support
