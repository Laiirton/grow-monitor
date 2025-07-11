const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    showNotification(title, body, image) {
      ipcRenderer.send('show-notification', { title, body, image });
    }
  },
  apiService: {
    fetchStockData() {
      return ipcRenderer.invoke('fetch-stock-data');
    }
  }
});
