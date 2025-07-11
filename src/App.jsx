import { useState, useEffect, useRef } from 'react';
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
  const [nextUpdateSeconds, setNextUpdateSeconds] = useState(60);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const monitoredItemsRef = useRef([]);
  
  const fetchStockData = async (isAutoUpdate = false) => {
    try {
      setIsUpdating(true);
      
      const data = await window.electron.apiService.fetchStockData();
      setStockData(data);
      setLoading(false);
      setLastUpdateTime(new Date());
      
      setNextUpdateSeconds(60);
      
      if (!isAutoUpdate) {
        setShowUpdateToast(true);
        setTimeout(() => {
          setShowUpdateToast(false);
        }, 3000);
      }
      
      checkMonitoredItems(data);
      
      setTimeout(() => {
        setIsUpdating(false);
      }, 800);
    } catch (err) {
      setError('Error loading data: ' + err);
      setLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    monitoredItemsRef.current = monitoredItems;
  }, [monitoredItems]);

  useEffect(() => {
    fetchStockData();
    const storedItems = localStorage.getItem('monitoredItems');
    if (storedItems) {
      setMonitoredItems(JSON.parse(storedItems));
    }
    const interval = setInterval(() => {
      setNextUpdateSeconds((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    
    const fetchInterval = setInterval(() => {
      fetchStockData(true);
    }, 60000);
    
    return () => {
      clearInterval(interval);
      clearInterval(fetchInterval);
    };
  }, []);

  // Removido efeito que atualizava lastUpdateTime quando nextUpdateSeconds = 60,
  // já que agora atualizamos explicitamente nas funções de atualização
  
  useEffect(() => {
    if (stockData && monitoredItems.length > 0) {
      const categoriesWithItems = updateCategoriesWithMonitoredItems(stockData, monitoredItems);
      setCategoriesWithMonitoredItems(categoriesWithItems);
    } else if (stockData && monitoredItems.length === 0) {
      setCategoriesWithMonitoredItems({});
    }
  }, [stockData, monitoredItems]);
  
  // Helper function to check categories with monitored items
  const updateCategoriesWithMonitoredItems = (data, items) => {
    if (!data || !items || items.length === 0) return {};
    
    const categoriesWithItems = {};
    const categories = ['seedsStock', 'gearStock', 'eggStock', 'honeyStock', 'cosmeticsStock'];
    
    items.forEach(item => {
      categories.forEach(category => {
        const foundItem = data[category]?.find(stockItem => 
          stockItem.name.toLowerCase() === item.name.toLowerCase()
        );
        
        if (foundItem && foundItem.value > 0) {
          // Mark this category as having monitored items available
          categoriesWithItems[category] = true;
        }
      });
    });
    
    return categoriesWithItems;
  };

  const checkMonitoredItems = (data) => {
    const currentMonitoredItems = monitoredItemsRef.current;
    if (!data || currentMonitoredItems.length === 0) return;
    
    let updatedMonitoredItems = [...currentMonitoredItems];
    let hasUpdates = false;
    
    currentMonitoredItems.forEach(item => {
      const categories = ['seedsStock', 'gearStock', 'eggStock', 'honeyStock', 'cosmeticsStock'];
      categories.forEach(category => {
        const foundItem = data[category]?.find(stockItem => 
          stockItem.name.toLowerCase() === item.name.toLowerCase()
        );
        
        if (foundItem) {
          const currentValue = foundItem.value;
          const previousValue = item.lastValue;
          
          if (currentValue > 0) {
            window.electron.notificationApi.showNotification(
              '🌱 Item em estoque!',
              `${foundItem.name} está disponível no estoque! (Quantidade: ${currentValue})`,
              foundItem.image
            );
          }
          
          if (currentValue !== previousValue) {
            updatedMonitoredItems = updatedMonitoredItems.map(monItem => 
              monItem.name === item.name 
                ? {...monItem, lastValue: currentValue}
                : monItem
            );
            hasUpdates = true;
          }
        }
      });
    });
    
    if (hasUpdates) {
      setMonitoredItems(updatedMonitoredItems);
      localStorage.setItem('monitoredItems', JSON.stringify(updatedMonitoredItems));
    }
    
    const categoriesWithItems = updateCategoriesWithMonitoredItems(data, updatedMonitoredItems);
    setCategoriesWithMonitoredItems(categoriesWithItems);
  };
  
  const addMonitoredItem = (name) => {
    if (!name.trim()) return;
    
    const trimmedName = name.trim();
    const itemExists = monitoredItems.some(item => item.name.toLowerCase() === trimmedName.toLowerCase());
    
    if (itemExists) return;
    
    const newItem = {
      name: trimmedName,
      lastValue: 0
    };
    
    const updatedItems = [...monitoredItems, newItem];
    setMonitoredItems(updatedItems);
    localStorage.setItem('monitoredItems', JSON.stringify(updatedItems));
    
    // Update the state of categories with monitored items
    if (stockData) {
      const updatedCategories = updateCategoriesWithMonitoredItems(stockData, updatedItems);
      setCategoriesWithMonitoredItems(updatedCategories);
    }
  };
  
  const removeMonitoredItem = (name) => {
    const updatedItems = monitoredItems.filter(item => item.name !== name);
    setMonitoredItems(updatedItems);
    localStorage.setItem('monitoredItems', JSON.stringify(updatedItems));
    
    // Update the state of categories with monitored items
    if (stockData) {
      const updatedCategories = updateCategoriesWithMonitoredItems(stockData, updatedItems);
      setCategoriesWithMonitoredItems(updatedCategories);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  
  if (error) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">{error}</div>;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Update notification */}
      {showUpdateToast && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center animate-fade-in-down backdrop-blur-sm">
          <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="font-medium">Stock updated successfully!</span>
        </div>
      )}
      
      <Sidebar 
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        categoriesWithMonitoredItems={categoriesWithMonitoredItems}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="p-4 lg:p-6 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-slate-400">
                <span>Last update: <span className="text-emerald-400 font-medium">{lastUpdateTime.toLocaleTimeString()}</span></span>
                <span>Next: <span className="text-emerald-400 font-medium">{nextUpdateSeconds}s</span></span>
              </div>
            </div>
            
            <button
              onClick={fetchStockData}
              disabled={isUpdating}
              className={`${
                isUpdating 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
              } text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed`}
            >
              <span className={`mr-2 inline-block ${isUpdating ? 'animate-spin' : ''}`}>
                {isUpdating ? '⟳' : '↻'}
              </span> 
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden p-4 lg:p-6">
          <div className="h-full grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 min-h-0">
              <StockDisplay 
                stockData={stockData} 
                activeCategory={activeCategory}
                monitoredItems={monitoredItems}
              />
            </div>
            
            <div className="xl:col-span-1 min-h-0">
              <MonitorPanel 
                monitoredItems={monitoredItems}
                addMonitoredItem={addMonitoredItem}
                removeMonitoredItem={removeMonitoredItem}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
