import React from 'react';

const categories = [
  { id: 'seedsStock', name: 'Sementes', icon: '🌱' },
  { id: 'gearStock', name: 'Ferramentas', icon: '🔧' },
  { id: 'eggStock', name: 'Ovos', icon: '🥚' },
  { id: 'cosmeticsStock', name: 'Decorações', icon: '🏡' },
  { id: 'honeyStock', name: 'Mel', icon: '🍯' },
];

function Sidebar({ activeCategory, setActiveCategory, categoriesWithMonitoredItems }) {
  return (
    <div className="w-64 bg-[#171c26] h-full flex flex-col shadow-xl border-r border-[#2a3042] overflow-hidden">
      <div className="py-6 px-4 border-b border-[#2a3042]">
        <div className="flex items-center justify-center">
          <span className="text-2xl mr-3">🌿</span>
          <span className="text-xl font-bold text-white">Menu</span>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          {categories.map((category) => {
            const hasMonitoredItems = categoriesWithMonitoredItems && categoriesWithMonitoredItems[category.id];
            
            return (
              <li key={category.id}>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center justify-between w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                    activeCategory === category.id 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white font-medium shadow-lg' 
                      : hasMonitoredItems
                        ? 'hover:bg-[#242a38] text-gray-300 border border-green-500/30 bg-green-500/10'
                        : 'hover:bg-[#242a38] text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-4 text-xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  {hasMonitoredItems && activeCategory !== category.id && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="px-4 py-3 mt-auto bg-[#141921]">
        <div className="text-xs text-gray-500 text-center">Grow Monitor v1.0.0</div>
      </div>
    </div>
  );
}

export default Sidebar;
