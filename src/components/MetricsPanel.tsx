import React from 'react';
import { EvaluationMetrics } from '../types';
import { BarChart3, Clock, Target, FileText, MessageSquare, Activity } from 'lucide-react';

interface MetricsPanelProps {
  metrics: EvaluationMetrics;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  const metricsData = [
    {
      label: 'Documents Processed',
      value: metrics.totalDocuments,
      icon: FileText,
      color: 'blue',
      format: (val: number) => val.toString()
    },
    {
      label: 'Total Queries',
      value: metrics.totalQueries,
      icon: MessageSquare,
      color: 'green',
      format: (val: number) => val.toString()
    },
    {
      label: 'Avg Response Time',
      value: metrics.responseLatency,
      icon: Clock,
      color: 'yellow',
      format: (val: number) => val > 0 ? `${val.toFixed(0)}ms` : 'N/A'
    },
    {
      label: 'Retrieval Accuracy',
      value: metrics.retrievalAccuracy,
      icon: Target,
      color: 'purple',
      format: (val: number) => val > 0 ? `${(val * 100).toFixed(1)}%` : 'N/A'
    },
    {
      label: 'OCR Accuracy',
      value: metrics.ocrAccuracy,
      icon: Activity,
      color: 'teal',
      format: (val: number) => val > 0 ? `${(val * 100).toFixed(1)}%` : 'N/A'
    },
    {
      label: 'Processing Time',
      value: metrics.documentProcessingTime,
      icon: BarChart3,
      color: 'red',
      format: (val: number) => val > 0 ? `${val.toFixed(0)}ms` : 'N/A'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      teal: 'bg-teal-50 text-teal-600 border-teal-200',
      red: 'bg-red-50 text-red-600 border-red-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <span>System Metrics</span>
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getColorClasses(metric.color)} transition-all duration-200 hover:shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className="w-4 h-4" />
                <span className="font-semibold">
                  {metric.format(metric.value)}
                </span>
              </div>
              <p className="text-xs opacity-80">{metric.label}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>System Status:</strong> {metrics.totalDocuments > 0 ? 'Ready for queries' : 'Waiting for documents'}
        </p>
        {metrics.totalQueries > 0 && (
          <p className="text-xs text-gray-600 mt-1">
            Last query processed {metrics.responseLatency.toFixed(0)}ms ago
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricsPanel;