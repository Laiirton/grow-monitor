import React from 'react';

const categories = [
  { id: 'seedsStock', name: 'Sementes', icon: '🌱' },
  { id: 'gearStock', name: 'Ferramentas', icon: '🔧' },
  { id: 'eggStock', name: 'Ovos', icon: '🥚' },
  { id: 'honeyStock', name: 'Mel', icon: '🍯' },
  { id: 'cosmeticsStock', name: 'Decorações', icon: '🏡' },
];

function Sidebar({ activeCategory, setActiveCategory }) {
  return (
    <div className="w-64 bg-gray-800 h-full p-4 flex flex-col">
      <div className="text-xl font-bold mb-8 flex items-center">
        <span className="mr-2">🌿</span> 
        <span>Menu</span>
      </div>
      
      <nav className="flex-1">
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="mb-2">
              <button
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center w-full p-3 rounded-md transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-green-700 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <span className="mr-3 text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-700 text-xs text-gray-400">
        <div>Grow Monitor v1.0.0</div>
      </div>
    </div>
  );
}

export default Sidebar;
