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
  const [nextUpdateSeconds, setNextUpdateSeconds] = useState(60);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const fetchStockData = async () => {
    try {
      // Indicate that the app is updating
      setIsUpdating(true);
      
      // Using the Electron API through preload
      const data = await window.electron.apiService.fetchStockData();
      setStockData(data);
      setLoading(false);
      setLastUpdateTime(new Date());
      
      // Show the toast notification
      setShowUpdateToast(true);
      
      // Hide automatically after 3 seconds
      setTimeout(() => {
        setShowUpdateToast(false);
      }, 3000);
      
      checkMonitoredItems(data);
      
      // End the animation after a short delay for visual feedback
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
    fetchStockData();
    const storedItems = localStorage.getItem('monitoredItems');
    if (storedItems) {
      setMonitoredItems(JSON.parse(storedItems));
    }
    const interval = setInterval(() => {
      setNextUpdateSeconds((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    const fetchInterval = setInterval(fetchStockData, 60000);
    return () => {
      clearInterval(interval);
      clearInterval(fetchInterval);
    };
  }, []);

  useEffect(() => {
    if (nextUpdateSeconds === 60) {
      setLastUpdateTime(new Date());
    }
  }, [nextUpdateSeconds]);
  
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
    if (!data || monitoredItems.length === 0) return;
    let updatedMonitoredItems = [...monitoredItems];
    let hasUpdates = false;
    monitoredItems.forEach(item => {
      const categories = ['seedsStock', 'gearStock', 'eggStock', 'honeyStock', 'cosmeticsStock'];
      categories.forEach(category => {
        const foundItem = data[category]?.find(stockItem => 
          stockItem.name.toLowerCase() === item.name.toLowerCase()
        );
        if (foundItem) {
          window.electron.notificationApi.showNotification(
            '🌱 Item disponível!',
            `${foundItem.name} está disponível no estoque!`
          );
          updatedMonitoredItems = updatedMonitoredItems.map(monItem => 
            monItem.name === item.name 
              ? {...monItem, lastValue: foundItem.value}
              : monItem
          );
          hasUpdates = true;
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
    <div className="flex h-screen bg-[#1a202c] text-white overflow-hidden">
      {/* Update notification */}
      {showUpdateToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-down">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Stock updated successfully!</span>
        </div>
      )}
      
      <Sidebar 
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        categoriesWithMonitoredItems={categoriesWithMonitoredItems}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 flex-1 overflow-hidden">
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={fetchStockData}
              disabled={isUpdating}
              className={`${
                isUpdating ? 'bg-green-700' : 'bg-green-600 hover:bg-green-500'
              } text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-md`}
            >
              <span className={`mr-2 inline-block ${isUpdating ? 'animate-spin' : ''}`}>↻</span> 
              {isUpdating ? 'Updating...' : 'Update Stock'}
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
            <span>Last update:</span>
            <span className="ml-1 text-green-400 font-medium">{lastUpdateTime.toLocaleTimeString()}</span>
            <span className="ml-4">Next update in <span className="text-green-400 font-medium">{nextUpdateSeconds}s</span></span>
          </div>
          <div>Garden Stock v1.0.0</div>
        </div>
      </div>
    </div>
  );
}

export default App;
