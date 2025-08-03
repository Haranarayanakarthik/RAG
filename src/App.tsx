// import React from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DocumentViewer from './components/DocumentViewer';
import ChatInterface from './components/ChatInterface';
import MetricsPanel from './components/MetricsPanel';
import { useRAGSystem } from './hooks/useRAGSystem';

function App() {
  const {
    documents,
    messages,
    metrics,
    isProcessing,
    processFiles,
    sendMessage,
    clearDocuments,
  } = useRAGSystem();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        onClearDocuments={clearDocuments}
        documentsCount={documents.length}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Left Panel - Upload and Documents */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Document Upload
              </h2>
              <FileUpload 
                onFileUpload={processFiles}
                isProcessing={isProcessing}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-y-auto">
              <DocumentViewer documents={documents} />
            </div>
            
            <MetricsPanel metrics={metrics} />
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;