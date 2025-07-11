import React from 'react';

const categoryTitles = {
  seedsStock: 'Available Seeds',
  gearStock: 'Available Tools',
  eggStock: 'Available Eggs',
  honeyStock: 'Available Honey',
  cosmeticsStock: 'Available Decorations',
  easterStock: 'Easter Items'
};

const categoryEmojis = {
  seedsStock: '🌱',
  gearStock: '🔧',
  eggStock: '🥚',
  honeyStock: '🍯',
  cosmeticsStock: '🏡',
  easterStock: '🐰'
};

function StockDisplay({ stockData, activeCategory, monitoredItems }) {
  if (!stockData || !stockData[activeCategory]) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-slate-400 text-lg font-medium">No items available</p>
        </div>
      </div>
    );
  }

  const items = stockData[activeCategory];
  
  // Verifica se o item está sendo monitorado
  const isItemMonitored = (itemName) => {
    return monitoredItems && monitoredItems.some(item => 
      item.name.toLowerCase() === itemName.toLowerCase()
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <header className="p-4 lg:p-6 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">{categoryEmojis[activeCategory] || '📦'}</span>
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              {categoryTitles[activeCategory] || 'Stock'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} available
            </p>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">😢</span>
              </div>
              <p className="text-slate-400 text-lg font-medium mb-2">No items available</p>
              <p className="text-slate-500 text-sm">Check back later for updates</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto category-scrollbar">
            <div className="category-grid">
              {items.map((item, index) => {
                const isMonitored = isItemMonitored(item.name);
                
                return (
                  <div 
                    key={`${item.name}-${index}`}
                    className={`item-card animate-bounce-in ${isMonitored ? 'monitored-item' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex flex-col items-center h-full">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 mb-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      
                      <div className="text-center flex-1 flex flex-col justify-center">
                        <h3 className="font-semibold text-white text-sm lg:text-base mb-2 line-clamp-2 text-shadow">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mt-auto">
                          <span className="text-xs text-slate-400">Qty:</span>
                          <span className="font-bold text-emerald-400 text-sm lg:text-base px-2 py-1 bg-emerald-500/20 rounded-full">
                            {item.value}
                          </span>
                        </div>
                        {isMonitored && (
                          <div className="mt-2 flex items-center justify-center">
                            <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30 animate-pulse-glow">
                              ✓ Monitored
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockDisplay;
