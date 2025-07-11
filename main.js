const { app, BrowserWindow, Tray, Menu, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const squirrelStartup = require('electron-squirrel-startup');
const https = require('https');
const http = require('http');


if (squirrelStartup) app.quit();

app.setAppUserModelId('garden-stock');

let mainWindow;
let tray = null;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    minWidth: 940,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'assets/icon.ico'),
    autoHideMenuBar: true, 
    frame: true, 
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Removido a abertura automática do DevTools
  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }
  
  // Center the window on the screen
  mainWindow.center();

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets/icon.ico');
  
  try {
    tray = new Tray(iconPath);
  } catch (error) {
    console.error('Error loading icon:', error);
    // Fallback to default Electron icon
    tray = new Tray();
  }
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Exit', click: () => {
      isQuitting = true;
      app.quit();
    }}
  ]);
  
  tray.setToolTip('Garden Stock');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});

// Function to fetch API data without CORS issues
ipcMain.handle('fetch-stock-data', () => {
  return new Promise((resolve, reject) => {
    const apiUrl = 'https://grow-a-garden-api-omega.vercel.app/api/stock';
    
    https.get(apiUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject('Erro ao processar dados: ' + error.message);
        }
      });
    }).on('error', (error) => {
      reject('Erro na requisição: ' + error.message);
    });
  });
});
