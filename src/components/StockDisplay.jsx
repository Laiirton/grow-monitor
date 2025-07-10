import React from 'react';

const categoryTitles = {
  seedsStock: 'Sementes Disponíveis',
  gearStock: 'Ferramentas Disponíveis',
  eggStock: 'Ovos Disponíveis',
  honeyStock: 'Mel Disponível',
  cosmeticsStock: 'Decorações Disponíveis',
  easterStock: 'Itens de Páscoa'
};

function StockDisplay({ stockData, activeCategory }) {
  if (!stockData || !stockData[activeCategory]) {
    return <div className="p-4 bg-gray-800 rounded-lg">Nenhum item disponível</div>;
  }

  const items = stockData[activeCategory];

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">{categoryTitles[activeCategory] || 'Estoque'}</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-400">Nenhum item disponível nesta categoria</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div 
              key={`${item.name}-${index}`}
              className="bg-gray-700 p-3 rounded-lg flex flex-col items-center"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-2">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
              <div className="text-center">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-300 mt-1">
                  Quantidade: <span className="font-bold text-green-400">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StockDisplay;
