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
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Painel de Monitoramento</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nome do item para monitorar"
            className="flex-1 bg-gray-700 rounded-l-md border border-gray-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-r-md"
          >
            +
          </button>
        </div>
      </form>
      
      <div className="space-y-2">
        <h3 className="font-medium text-gray-300 mb-2">Itens Monitorados:</h3>
        
        {monitoredItems.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum item sendo monitorado</p>
        ) : (
          <ul className="space-y-2">
            {monitoredItems.map((item) => (
              <li 
                key={item.name}
                className="bg-gray-700 rounded-md p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-400">
                    Último valor: {item.lastValue}
                  </div>
                </div>
                <button
                  onClick={() => removeMonitoredItem(item.name)}
                  className="text-red-400 hover:text-red-300 focus:outline-none"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Você receberá notificações quando um item monitorado estiver disponível.
        </p>
      </div>
    </div>
  );
}

export default MonitorPanel;
