import React from 'react';

const categoryTitles = {
  seedsStock: 'Sementes Disponíveis',
  gearStock: 'Ferramentas Disponíveis',
  eggStock: 'Ovos Disponíveis',
  honeyStock: 'Mel Disponível',
  cosmeticsStock: 'Decorações Disponíveis',
  easterStock: 'Itens de Páscoa'
};

function StockDisplay({ stockData, activeCategory, monitoredItems }) {
  if (!stockData || !stockData[activeCategory]) {
    return <div className="p-4 bg-gray-800 rounded-lg">Nenhum item disponível</div>;
  }

  const items = stockData[activeCategory];
  
  // Verifica se o item está sendo monitorado
  const isItemMonitored = (itemName) => {
    return monitoredItems && monitoredItems.some(item => 
      item.name.toLowerCase() === itemName.toLowerCase()
    );
  };

  return (
    <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg border border-[#2a3042]">
      <h2 className="text-2xl font-semibold mb-6 pb-3 border-b border-[#374151]">{categoryTitles[activeCategory] || 'Estoque'}</h2>
      
      {items.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">😢</div>
          <p className="text-gray-400 text-lg">Nenhum item disponível nesta categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item, index) => {
            const isMonitored = isItemMonitored(item.name);
            
            return (
              <div 
                key={`${item.name}-${index}`}
                className={`bg-[#252e3f] hover:bg-[#2a334a] transition-all duration-200 p-4 rounded-xl flex flex-col items-center shadow-md ${isMonitored ? 'subtle-monitored rainbow-glow z-10' : 'border border-[#374151]'}`}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-4 bg-[#1a202c] rounded-xl p-3 relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                  />
                  {isMonitored && (
                    <div className="absolute top-0 right-0 bg-green-500 w-3 h-3 rounded-full border border-white -mt-1 -mr-1 opacity-80" 
                         title="Item monitorado"/>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-white text-lg">{item.name}</div>
                  <div className="text-sm text-gray-300 mt-2">
                    Quantidade: <span className="font-bold text-green-400 ml-1">{item.value}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StockDisplay;
