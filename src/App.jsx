import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StockDisplay from './components/StockDisplay';
import MonitorPanel from './components/MonitorPanel';

function App() {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('seedsStock');
  const [monitoredItems, setMonitoredItems] = useState([]);
  const [categoriesWithMonitoredItems, setCategoriesWithMonitoredItems] = useState({});
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  
  const fetchStockData = async () => {
    try {
      // Usando a API do Electron através do preload
      const data = await window.electron.apiService.fetchStockData();
      setStockData(data);
      setLoading(false);
      setLastUpdateTime(new Date());
      
      checkMonitoredItems(data);
    } catch (err) {
      setError('Erro ao carregar dados: ' + err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    
    const storedItems = localStorage.getItem('monitoredItems');
    if (storedItems) {
      setMonitoredItems(JSON.parse(storedItems));
    }
    
    const interval = setInterval(fetchStockData, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const checkMonitoredItems = (data) => {
    if (!data || monitoredItems.length === 0) return;
    
    const categoriesWithItems = {};
    
    monitoredItems.forEach(item => {
      const categories = ['seedsStock', 'gearStock', 'eggStock', 'honeyStock', 'cosmeticsStock'];
      
      categories.forEach(category => {
        const foundItem = data[category]?.find(stockItem => 
          stockItem.name.toLowerCase() === item.name.toLowerCase()
        );
        
        if (foundItem && foundItem.value > 0) {
          // Marca esta categoria como tendo itens monitorados disponíveis
          categoriesWithItems[category] = true;
        }
        
        if (foundItem && foundItem.value > item.lastValue) {
          window.electron.notificationApi.showNotification(
            '🌱 Item Disponível!',
            `${foundItem.name} está disponível (${foundItem.value} unidades)!`
          );
          
          const updatedItems = monitoredItems.map(monItem => 
            monItem.name === item.name 
              ? {...monItem, lastValue: foundItem.value}
              : monItem
          );
          
          setMonitoredItems(updatedItems);
          localStorage.setItem('monitoredItems', JSON.stringify(updatedItems));
        }
      });
    });
    
    setCategoriesWithMonitoredItems(categoriesWithItems);
  };
  
  const addMonitoredItem = (name) => {
    if (!name.trim()) return;
    
    const newItem = {
      name: name.trim(),
      lastValue: 0
    };
    
    const updatedItems = [...monitoredItems, newItem];
    setMonitoredItems(updatedItems);
    localStorage.setItem('monitoredItems', JSON.stringify(updatedItems));
  };
  
  const removeMonitoredItem = (name) => {
    const updatedItems = monitoredItems.filter(item => item.name !== name);
    setMonitoredItems(updatedItems);
    localStorage.setItem('monitoredItems', JSON.stringify(updatedItems));
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Carregando...</div>;
  
  if (error) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">{error}</div>;

  return (
    <div className="flex h-screen bg-[#1a202c] text-white overflow-hidden">
      <Sidebar 
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        categoriesWithMonitoredItems={categoriesWithMonitoredItems}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Grow Monitor</h1>
            
            <button
              onClick={fetchStockData}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center shadow-md"
            >
              <span className="mr-2">↻</span> Atualizar Estoque
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StockDisplay 
                stockData={stockData} 
                activeCategory={activeCategory}
                monitoredItems={monitoredItems}
              />
            </div>
            
            <div>
              <MonitorPanel 
                monitoredItems={monitoredItems}
                addMonitoredItem={addMonitoredItem}
                removeMonitoredItem={removeMonitoredItem}
              />
            </div>
          </div>
        </div>
        
        <div className="px-6 py-2 border-t border-gray-800 text-xs text-gray-500 bg-[#171c26] flex justify-between items-center">
          <div className="flex items-center">
            <span>Última atualização:</span>
            <span className="ml-1 text-green-400 font-medium">{lastUpdateTime.toLocaleTimeString()}</span>
          </div>
          <div>Grow Monitor v1.0.0</div>
        </div>
      </div>
    </div>
  );
}

export default App;
