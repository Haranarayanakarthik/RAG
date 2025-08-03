import React from 'react';
import { ProcessedDocument } from '../types';
import { FileText, Image, Table, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentViewerProps {
  documents: ProcessedDocument[];
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FileText className="w-12 h-12 mb-2" />
        <p>No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Processed Documents ({documents.length})
      </h3>
      
      {documents.map((doc) => (
        <div key={doc.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {doc.type.startsWith('image/') ? (
                <Image className="w-5 h-5 text-purple-500" />
              ) : (
                <FileText className="w-5 h-5 text-blue-500" />
              )}
              <span className="font-medium text-gray-800 truncate">{doc.name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {doc.processingStatus === 'completed' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {doc.processingStatus === 'processing' && (
                <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
              )}
              {doc.processingStatus === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>

          {doc.processingStatus === 'completed' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <span className="text-blue-600 font-medium">Text Chunks</span>
                  <p className="text-gray-700">{doc.chunks.length}</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-green-600 font-medium">Tables</span>
                  <p className="text-gray-700">{doc.tables.length}</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <span className="text-purple-600 font-medium">Images</span>
                  <p className="text-gray-700">{doc.images.length}</p>
                </div>
              </div>

              {doc.extractedText && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Extracted Text Preview</h4>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {doc.extractedText.substring(0, 200)}...
                  </p>
                </div>
              )}

              {doc.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {doc.images.slice(0, 2).map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Extracted from ${doc.name}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              {doc.tables.length > 0 && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Table className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      {doc.tables.length} table(s) detected
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {doc.processingStatus === 'processing' && (
            <div className="flex items-center space-x-2 text-yellow-600">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing document...</span>
            </div>
          )}

          {doc.processingStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Failed to process document</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentViewer;