import React, { useState } from 'react';

interface LogEntry {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  timestamp?: string;
}

interface ConsoleLogProps {
  logs: (LogEntry | string)[];
}

const ConsoleLog: React.FC<ConsoleLogProps> = ({ logs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  // Process logs to ensure consistent format
  const processedLogs = logs.map((log, index) => {
    if (typeof log === 'string') {
      // Detect log type based on content
      let type: 'info' | 'warning' | 'error' | 'success' = 'info';
      if (log.toLowerCase().includes('error') || log.toLowerCase().includes('fail')) {
        type = 'error';
      } else if (log.toLowerCase().includes('warn')) {
        type = 'warning';
      } else if (log.toLowerCase().includes('success')) {
        type = 'success';
      }
      
      return {
        message: log,
        type,
        timestamp: new Date().toISOString()
      };
    }
    return log;
  });
  
  // Filter logs if filter is active
  const filteredLogs = filter 
    ? processedLogs.filter(log => 
        typeof log !== 'string' && log.type === filter
      )
    : processedLogs;

  return (
    <div className="rounded-lg border border-zinc-200 shadow-sm mb-6 overflow-hidden">
      {/* Header with toggle */}
      <div 
        className="flex items-center justify-between px-4 py-2 bg-zinc-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-sm font-medium flex items-center gap-2">
          <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded-full">
            {logs.length}
          </span>
          Console Logs
        </h2>
        <div className="flex gap-2 items-center">
          {isExpanded && (
            <div className="flex rounded-md overflow-hidden text-xs">
              <button 
                onClick={(e) => {e.stopPropagation(); setFilter(null)}}
                className={`px-2 py-1 ${!filter ? 'bg-blue-500 text-white' : 'bg-zinc-200'}`}
              >
                All
              </button>
              <button 
                onClick={(e) => {e.stopPropagation(); setFilter('info')}}
                className={`px-2 py-1 ${filter === 'info' ? 'bg-blue-500 text-white' : 'bg-zinc-200'}`}
              >
                Info
              </button>
              <button 
                onClick={(e) => {e.stopPropagation(); setFilter('warning')}}
                className={`px-2 py-1 ${filter === 'warning' ? 'bg-blue-500 text-white' : 'bg-zinc-200'}`}
              >
                Warnings
              </button>
              <button 
                onClick={(e) => {e.stopPropagation(); setFilter('error')}}
                className={`px-2 py-1 ${filter === 'error' ? 'bg-blue-500 text-white' : 'bg-zinc-200'}`}
              >
                Errors
              </button>
            </div>
          )}
          <span className="text-zinc-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      
      {/* Log content */}
      {isExpanded && (
        <div className="relative">
          <div 
            className="max-h-64 overflow-y-auto p-3 bg-zinc-50 font-mono text-xs"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db transparent'
            }}
          >
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => {
                // Handle both string and LogEntry types
                const entry = typeof log === 'string' 
                  ? { message: log, type: 'info' as const } 
                  : log;
                
                // Style based on log type
                const logTypeStyles = {
                  info: 'text-blue-600 border-blue-200 bg-blue-50',
                  warning: 'text-amber-600 border-amber-200 bg-amber-50',
                  error: 'text-red-600 border-red-200 bg-red-50',
                  success: 'text-emerald-600 border-emerald-200 bg-emerald-50'
                };
                
                const style = logTypeStyles[entry.type || 'info'];
                
                return (
                  <div 
                    key={index}
                    className={`py-1 px-2 mb-1 rounded border-l-2 ${style} flex`}
                  >
                    {entry.timestamp && (
                      <span className="text-zinc-400 mr-2 min-w-[60px]">
                        {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                      </span>
                    )}
                    <span>{entry.message}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-zinc-400 py-6 text-center">No logs to display</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsoleLog;