import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { registerFileHandlers } from './ipc/handlers/fileHandlers';

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  console.log('Creating window...');
  console.log('isDev:', isDev);
  
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // Ace Attorney style with standard window controls
    backgroundColor: '#1f3453',
    // Changed: Use standard frame with title bar
    frame: true, 
    show: false, // Don't show until content is loaded
    icon: path.join(__dirname, isDev ? '../../editor/public/icon.png' : '../editor/dist/icon.png'),
  });

  // Register IPC handlers
  registerFileHandlers();
  
  // Load the app
  loadApplication(mainWindow);
  
  // Show window once ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  
  // Add error handler for loading errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Load failed:', errorCode, errorDescription);
    
    // Reload on failure - sometimes helps with timing issues
    if (errorCode !== -3) { // Ignore aborted loads
      setTimeout(() => {
        console.log('Attempting to reload...');
        loadApplication(mainWindow);
      }, 1000);
    }
  });
}

function loadApplication(mainWindow: BrowserWindow) {
  if (isDev) {
    // In development, connect to Vite dev server
    console.log('Development mode: Connecting to dev server...');
    mainWindow.loadURL('http://localhost:5173')
      .catch((err) => {
        console.log('Failed to connect to dev server:', err);
        console.log('Falling back to built files');
        loadFromBuiltFiles(mainWindow);
      });
  } else {
    // In production, load from the bundled files
    console.log('Production mode: Loading from bundled files');
    loadFromBuiltFiles(mainWindow);
  }
}

function loadFromBuiltFiles(mainWindow: BrowserWindow) {
  // Log paths for debugging
  console.log('App path:', app.getAppPath());
  console.log('__dirname:', __dirname);
  console.log('Resource path:', process.resourcesPath);
  
  let indexHtmlPath = '';
  
  if (isDev) {
    // Development paths
    indexHtmlPath = path.join(__dirname, '../../editor/dist/index.html');
    if (!fs.existsSync(indexHtmlPath)) {
      indexHtmlPath = path.join(__dirname, '../editor/dist/index.html');
    }
  } else {
    // Production path - use the extraResources location
    indexHtmlPath = path.join(process.resourcesPath, 'editor/dist/index.html');
  }
  
  console.log(`Loading HTML from: ${indexHtmlPath}`);
  console.log(`File exists: ${fs.existsSync(indexHtmlPath)}`);
  
  // List the contents of the directory for debugging
  const dirPath = path.dirname(indexHtmlPath);
  if (fs.existsSync(dirPath)) {
    console.log(`Directory contents of ${dirPath}:`);
    try {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        console.log(` - ${file}`);
      });
    } catch (err) {
      console.error('Error reading directory:', err);
    }
  } else {
    console.log(`Directory ${dirPath} does not exist!`);
  }
  
  if (fs.existsSync(indexHtmlPath)) {
    // Use loadFile instead of loadURL for local files
    mainWindow.loadFile(indexHtmlPath)
      .catch(err => {
        console.error('Error loading file:', err);
        showErrorPage(mainWindow, indexHtmlPath);
      });
  } else {
    // Show error if file not found
    showErrorPage(mainWindow, indexHtmlPath);
  }
}

function showErrorPage(mainWindow: BrowserWindow, indexHtmlPath: string) {
  mainWindow.loadURL(`data:text/html,
    <html>
      <head>
        <title>Error Loading Application</title>
        <style>
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background-color: #1f3453; 
            color: #fff; 
            padding: 40px; 
            line-height: 1.6;
          }
          h1 { color: #e74c3c; }
          pre { 
            background: rgba(0,0,0,0.3); 
            padding: 15px; 
            border-radius: 6px; 
            overflow: auto;
            max-height: 300px;
          }
        </style>
      </head>
      <body>
        <h1>Error: Could not find application files</h1>
        <p>The application could not locate the required HTML file to run.</p>
        <h3>Path Information:</h3>
        <pre>
App path: ${app.getAppPath()}
__dirname: ${__dirname}
Resource path: ${process.resourcesPath}
Expected index.html: ${indexHtmlPath}
File exists: ${fs.existsSync(indexHtmlPath)}
        </pre>
        <p>This could be due to missing files in the resources directory where electron-builder places extraResources.</p>
      </body>
    </html>`);
}

// When Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// On macOS, recreate window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});