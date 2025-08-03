import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null);
    
    if (rejectedFiles.length > 0) {
      setUploadError('Some files were rejected. Please upload PDF, JPG, or PNG files only.');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 10,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isProcessing
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <Upload className="w-8 h-8 text-blue-500" />
            <FileText className="w-8 h-8 text-green-500" />
            <Image className="w-8 h-8 text-purple-500" />
          </div>
          
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {isDragActive ? 'Drop the files here...' : 'Upload Documents'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports PDF, JPG, PNG • Max 50MB per file
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;