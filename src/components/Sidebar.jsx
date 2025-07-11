import React from 'react';

const categories = [
  { id: 'seedsStock', name: 'Seeds', icon: '🌱', gradient: 'from-green-500 to-emerald-500' },
  { id: 'gearStock', name: 'Tools', icon: '🔧', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'eggStock', name: 'Eggs', icon: '🥚', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'cosmeticsStock', name: 'Decorations', icon: '🏡', gradient: 'from-purple-500 to-pink-500' },
  { id: 'honeyStock', name: 'Honey', icon: '🍯', gradient: 'from-amber-500 to-yellow-500' },
];

function Sidebar({ activeCategory, setActiveCategory, categoriesWithMonitoredItems }) {
  return (
    <div className="w-64 lg:w-72 sidebar-modern h-full flex flex-col shadow-2xl overflow-hidden">
      <div className="py-6 px-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-3">
            <span className="text-xl">🌿</span>
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Categories
          </span>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {categories.map((category, index) => {
            const hasMonitoredItems = categoriesWithMonitoredItems && categoriesWithMonitoredItems[category.id];
            const isActive = activeCategory === category.id;
            
            return (
              <li key={category.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`sidebar-item ${isActive ? 'active' : ''} w-full py-3 px-4 flex items-center justify-between group`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : hasMonitoredItems 
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20' 
                          : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                    }`}>
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-white' 
                        : hasMonitoredItems 
                          ? 'text-emerald-300' 
                          : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {category.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {hasMonitoredItems && !isActive && (
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse-glow"></div>
                    )}
                    {isActive && (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="px-4 py-4 bg-slate-900/50 border-t border-slate-700/50">
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Garden Stock Monitor</div>
          <div className="text-xs text-slate-400 font-medium">v2.0.0</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
