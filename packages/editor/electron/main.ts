import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    // Ace Attorney style
    backgroundColor: '#1f3453',
    titleBarStyle: 'hidden',
    frame: false,
    icon: path.join(__dirname, '../public/icon.png'),
  });

  // Load the app URL
  if (isDev) {
    // In development, load from dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the built files
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  // Event when window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
  });
}

// When Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});