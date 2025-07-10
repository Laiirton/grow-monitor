const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    showNotification(title, body) {
      ipcRenderer.send('show-notification', { title, body });
    }
  },
  apiService: {
    fetchStockData() {
      return ipcRenderer.invoke('fetch-stock-data');
    }
  }
});
