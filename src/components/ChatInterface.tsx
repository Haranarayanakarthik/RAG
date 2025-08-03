import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, MessageCircle, FileText, TrendingUp } from "lucide-react";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isProcessing,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isProcessing) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const suggestedQuestions = [
    "What are the main cancer statistics mentioned?",
    "What are the key findings about cancer rates?",
    "Summarize the cancer incidence data",
    "What demographic information is provided?",
    "What are the survival rates mentioned?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">Document Q&A</h3>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            RAG-Powered
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              Ready to analyze your documents
            </p>
            <p className="text-sm mb-6">
              Upload documents and start asking questions!
            </p>

            <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 text-sm"
                  disabled={isProcessing}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {message.relevantChunks &&
                  message.relevantChunks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Sources ({message.relevantChunks.length})
                        </span>
                        {message.confidence && (
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">
                              {Math.round(message.confidence * 100)}% confidence
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        {message.relevantChunks.slice(0, 2).map((chunk) => (
                          <div
                            key={chunk.id}
                            className="text-xs bg-gray-100 p-2 rounded"
                          >
                            <span className="font-medium text-gray-600">
                              {chunk.sourceFile}
                            </span>
                            <p className="text-gray-500 mt-1 line-clamp-2">
                              {chunk.content.substring(0, 100)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <p className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <span className="text-sm text-gray-500 ml-2">
                  Analyzing documents...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask questions about your documents..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
