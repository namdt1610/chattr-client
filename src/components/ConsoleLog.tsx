import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Layers, AlertTriangle, AlertCircle, Check } from 'lucide-react';

interface LogEntry {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  timestamp?: string;
}

interface ConsoleLogProps {
  logs: (LogEntry | string)[];
  initialExpanded?: boolean;
}

const ConsoleLog: React.FC<ConsoleLogProps> = ({ logs, initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [filter, setFilter] = useState<string | null>(null);

  // Process logs to ensure consistent format
  const processedLogs = logs.map((log) => {
    if (typeof log === 'string') {
      const lowerCaseLog = log.toLowerCase();
      // Detect log type based on content
      let type: 'info' | 'warning' | 'error' | 'success' = 'info';
      if (lowerCaseLog.includes('error') || lowerCaseLog.includes('fail') || lowerCaseLog.includes('exception')) {
        type = 'error';
      } else if (lowerCaseLog.includes('warn')) {
        type = 'warning';
      } else if (lowerCaseLog.includes('success') || lowerCaseLog.includes('complete')) {
        type = 'success';
      }
      
      return {
        message: log,
        type,
        timestamp: new Date().toISOString()
      };
    }
    return {
      ...log,
      timestamp: log.timestamp || new Date().toISOString()
    };
  });

  // Filter and count logs by type
  const logCounts = {
    total: processedLogs.length,
    info: processedLogs.filter(log => log.type === 'info').length,
    warning: processedLogs.filter(log => log.type === 'warning').length,
    error: processedLogs.filter(log => log.type === 'error').length,
    success: processedLogs.filter(log => log.type === 'success').length
  };
  
  // Filter logs if filter is active
  const filteredLogs = filter 
    ? processedLogs.filter(log => log.type === filter)
    : processedLogs;

  // Prevent event bubbling for filter buttons
  const handleFilterClick = (newFilter: string | null) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilter(newFilter);
  };

  return (
    <div className="rounded-lg border border-zinc-200 shadow-sm overflow-hidden bg-white">
      {/* Header with toggle */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-zinc-50 to-zinc-100 cursor-pointer hover:from-zinc-100 hover:to-zinc-200 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-sm font-medium flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              {logCounts.total}
            </span>
            <span>Console Logs</span>
          </span>
          
          {/* Log type indicators - always visible */}
          <div className="flex gap-1 ml-2">
            {logCounts.error > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <AlertCircle size={10} /> {logCounts.error}
              </span>
            )}
            {logCounts.warning > 0 && (
              <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <AlertTriangle size={10} /> {logCounts.warning}
              </span>
            )}
            {logCounts.success > 0 && (
              <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <Check size={10} /> {logCounts.success}
              </span>
            )}
          </div>
        </h2>
        
        <div className="flex gap-2 items-center">
          {isExpanded && (
            <div className="flex rounded-md overflow-hidden text-xs shadow-sm">
              <button 
                onClick={handleFilterClick(null)}
                className={`px-3 py-1 flex items-center gap-1 font-medium transition-colors ${
                  !filter 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Layers size={12} />
                All
              </button>
              <button 
                onClick={handleFilterClick('info')}
                className={`px-3 py-1 font-medium transition-colors ${
                  filter === 'info' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Info ({logCounts.info})
              </button>
              <button 
                onClick={handleFilterClick('warning')}
                className={`px-3 py-1 font-medium transition-colors ${
                  filter === 'warning' 
                    ? 'bg-amber-500 text-white hover:bg-amber-600' 
                    : 'bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Warnings ({logCounts.warning})
              </button>
              <button 
                onClick={handleFilterClick('error')}
                className={`px-3 py-1 font-medium transition-colors ${
                  filter === 'error' 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Errors ({logCounts.error})
              </button>
              <button 
                onClick={handleFilterClick('success')}
                className={`px-3 py-1 font-medium transition-colors ${
                  filter === 'success' 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Success ({logCounts.success})
              </button>
            </div>
          )}
          <button className="text-zinc-500 focus:outline-none p-1 rounded hover:bg-zinc-200 transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      
      {/* Log content with animation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div 
              className="max-h-[400px] overflow-y-auto p-0 bg-white font-mono text-xs border-t border-zinc-200"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#d1d5db transparent'
              }}
            >
              {filteredLogs.length > 0 ? (
                <table className="w-full table-auto border-collapse">
                  <thead className="sticky top-0 bg-zinc-50 shadow-sm">
                    <tr>
                      <th className="w-24 py-2 px-3 text-left text-zinc-500 font-medium border-b border-zinc-200">Time</th>
                      <th className="w-20 py-2 px-3 text-left text-zinc-500 font-medium border-b border-zinc-200">Type</th>
                      <th className="py-2 px-3 text-left text-zinc-500 font-medium border-b border-zinc-200">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, index) => {
                      // Style based on log type
                      const logTypeColors = {
                        info: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', badge: 'bg-blue-100' },
                        warning: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', badge: 'bg-amber-100' },
                        error: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', badge: 'bg-red-100' },
                        success: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-100' }
                      };
                      
                      const style = logTypeColors[log.type || 'info'];
                      const formattedTime = new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      });
                      
                      const LogIcon = {
                        info: () => <div className="w-3 h-3 rounded-full bg-blue-400"></div>,
                        warning: () => <AlertTriangle size={13} className="text-amber-500" />,
                        error: () => <AlertCircle size={13} className="text-red-500" />,
                        success: () => <Check size={13} className="text-emerald-500" />
                      };
                      
                      const Icon = LogIcon[log.type || 'info'];
                      
                      return (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`hover:${style.bg} border-b border-zinc-100`}
                          transition={{ delay: index * 0.02, duration: 0.1 }}
                        >
                          <td className="py-2 px-3 text-zinc-400 border-r border-zinc-100">{formattedTime}</td>
                          <td className="py-2 px-3 border-r border-zinc-100">
                            <div className="flex items-center gap-1.5">
                              <Icon />
                              <span className={`capitalize font-medium ${style.text}`}>{log.type}</span>
                            </div>
                          </td>
                          <td className={`py-2 px-3 ${style.text}`}>{log.message}</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                  <Layers size={24} className="mb-2 opacity-50" />
                  <p>{filter ? `No ${filter} logs to display` : 'No logs to display'}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsoleLog;