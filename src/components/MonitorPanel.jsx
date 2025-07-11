import React, { useState } from 'react';

function MonitorPanel({ monitoredItems, addMonitoredItem, removeMonitoredItem }) {
  const [newItemName, setNewItemName] = useState('');
  const [duplicateError, setDuplicateError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItemName.trim()) {
      const itemExists = monitoredItems.some(
        item => item.name.toLowerCase() === newItemName.trim().toLowerCase()
      );
      
      if (itemExists) {
        setDuplicateError(`"${newItemName}" is already being monitored!`);
        setTimeout(() => setDuplicateError(''), 3000);
      } else {
        addMonitoredItem(newItemName);
        setNewItemName('');
        setDuplicateError('');
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <header className="p-4 lg:p-6 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔔</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Monitor Panel
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Track your favorite items
            </p>
          </div>
        </div>
      </header>
      
      <div className="p-4 lg:p-6 border-b border-slate-700/50">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-stretch rounded-xl shadow-lg bg-slate-700/50 border border-slate-600/50">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter item name to monitor"
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-inset rounded-l-xl"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 transition-all duration-200 font-bold text-xl flex items-center justify-center w-12 rounded-r-xl hover:shadow-lg shrink-0"
              title="Add item to monitor"
            >
              +
            </button>
          </div>
          
          {duplicateError && (
            <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm animate-fade-in backdrop-blur-sm">
              <div className="flex items-center">
                <span className="mr-2 text-base">⚠️</span>
                <span>{duplicateError}</span>
              </div>
            </div>
          )}
        </form>
      </div>
      
      <div className="flex-1 overflow-hidden p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-200 text-lg">
            Monitored Items
          </h3>
          <div className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-400">
            {monitoredItems.length}
          </div>
        </div>
        
        {monitoredItems.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">No items monitored yet</p>
              <p className="text-slate-500 text-xs">Add items above to get notified when they're available</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto monitor-scrollbar">
            <div className="space-y-3">
              {monitoredItems.map((item, index) => (
                <div 
                  key={item.name}
                  className="bg-slate-700/30 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 rounded-xl p-4 border border-slate-600/30 hover:border-slate-500/50 animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm lg:text-base truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <span className="mr-1">Last value:</span>
                        <span className="font-medium text-emerald-400 px-2 py-0.5 bg-emerald-500/20 rounded-full">
                          {item.lastValue}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMonitoredItem(item.name)}
                      className="ml-3 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Remove from monitoring"
                    >
                      <span className="text-sm">✕</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <footer className="p-4 lg:p-6 bg-slate-800/50 border-t border-slate-700/50">
        <div className="flex items-center text-xs text-slate-400">
          <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-xs">🔔</span>
          </div>
          <p className="leading-relaxed">
            You'll receive notifications when monitored items become available in the stock.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MonitorPanel;
