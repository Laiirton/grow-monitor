import React, { useState } from 'react';

function MonitorPanel({ monitoredItems, addMonitoredItem, removeMonitoredItem }) {
  const [newItemName, setNewItemName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addMonitoredItem(newItemName);
      setNewItemName('');
    }
  };

  return (
    <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg border border-[#2a3042] h-full">
      <h2 className="text-2xl font-semibold mb-6 pb-3 border-b border-[#374151]">Monitoring Panel</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex shadow-lg">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name to monitor"
            className="flex-1 bg-[#252e3f] rounded-l-lg border border-[#374151] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white px-4 rounded-r-lg transition-colors duration-200 font-medium text-lg"
            title="Add item to monitor"
          >
            +
          </button>
        </div>
      </form>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-200 mb-4 text-lg">Monitored Items:</h3>
        
        {monitoredItems.length === 0 ? (
          <div className="bg-[#252e3f] rounded-lg p-5 text-center">
            <p className="text-gray-400 text-sm">No items currently being monitored</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {monitoredItems.map((item) => (
              <li 
                key={item.name}
                className="bg-[#252e3f] hover:bg-[#2a334a] transition-all duration-200 rounded-lg p-4 flex justify-between items-center border border-[#374151] shadow-md"
              >
                <div>
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Last value: <span className="font-medium text-green-400">{item.lastValue}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeMonitoredItem(item.name)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full w-7 h-7 flex items-center justify-center focus:outline-none transition-colors duration-200"
                  title="Remove from monitoring"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-auto pt-4 border-t border-[#374151] bg-[#1a2233] mx-[-24px] px-6 py-4 rounded-b-xl">
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-2 text-lg">🔔</span>
          <p>
            You'll receive notifications when a monitored item is available.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MonitorPanel;
