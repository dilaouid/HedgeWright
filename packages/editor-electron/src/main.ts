import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { registerFileHandlers } from './ipc/handlers/fileHandlers';

// Determine if we're in development mode
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
    show: false, // Don't show until content is loaded
    icon: path.join(__dirname, isDev ? '../../editor/public/icon.png' : '../editor/dist/icon.png'),
  });

  // Register IPC handlers
  registerFileHandlers();
  
  // Determine how to load the app
  loadApplication(mainWindow);
  
  // Show window once ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Event when window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
  });
}

function loadApplication(mainWindow: BrowserWindow) {
  if (isDev) {
    // In development, try the dev server first
    console.log('Development mode: Trying to connect to dev server...');
    mainWindow.loadURL('http://localhost:5173')
      .catch(() => {
        console.log('Failed to connect to dev server, falling back to file');
        loadFromFile(mainWindow);
      });
    
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load directly from file
    console.log('Production mode: Loading from bundled files');
    loadFromFile(mainWindow);
  }
}

function loadFromFile(mainWindow: BrowserWindow) {
  // The path resolution logic is critical for both dev and production
  console.log('App path:', app.getAppPath());
  console.log('__dirname:', __dirname);
  
  // For production, we need to check both the extraResources location and relative paths
  const possiblePaths = [
    // Production paths (extraResources)
    path.join(app.getAppPath(), 'editor/dist/index.html'),
    
    // Dev paths
    path.join(__dirname, '../editor/dist/index.html'),
    path.join(__dirname, '../../editor/dist/index.html'),
    
    // Fallback paths
    path.join(app.getPath('exe'), '../editor/dist/index.html'),
    path.join(app.getPath('exe'), '../resources/editor/dist/index.html'),
  ];
  
  // Try to find a path that exists
  for (const p of possiblePaths) {
    console.log(`Checking path: ${p}, exists: ${fs.existsSync(p)}`);
    if (fs.existsSync(p)) {
      console.log(`Found HTML at: ${p}`);
      
      // Set proper base path for relative resources
      const baseUrl = path.dirname(p).replace(/\\/g, '/');
      console.log(`Setting base URL: file://${baseUrl}/`);
      
      // Use loadFile for local files with proper base URL
      mainWindow.loadFile(p);
      return;
    }
  }
  
  // If no path found, show diagnostic information
  console.error('Could not find index.html in any expected location');
  mainWindow.loadURL(`data:text/html,
    <html>
      <head><title>Error Loading Application</title></head>
      <body style="font-family: sans-serif; padding: 20px;">
        <h1>Error: Could not find index.html</h1>
        <p>Application path: ${app.getAppPath()}</p>
        <p>__dirname: ${__dirname}</p>
        <p>Executable path: ${app.getPath('exe')}</p>
        <p>Checked paths:</p>
        <ul>${possiblePaths.map(p => `<li>${p} (exists: ${fs.existsSync(p)})</li>`).join('')}</ul>
      </body>
    </html>`);
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