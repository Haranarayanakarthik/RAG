import React from "react";
import { Brain, FileSearch, Zap, Github } from "lucide-react";

interface HeaderProps {
  onClearDocuments: () => void;
  documentsCount: number;
}

const Header: React.FC<HeaderProps> = ({
  onClearDocuments,
  documentsCount,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="w-8 h-8 text-blue-600" />
                <FileSearch className="w-4 h-4 text-purple-500 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VisualRAG</h1>
                <p className="text-xs text-gray-500">
                  Document Analysis System
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 ml-8">
              <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  OCR + RAG
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Healthcare Domain</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {documentsCount > 0 && (
              <button
                onClick={onClearDocuments}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                Clear All ({documentsCount})
              </button>
            )}

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <a
                href="https://github.com/Haranarayanakarthik/RAG"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">View Code</span>
              </a>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
