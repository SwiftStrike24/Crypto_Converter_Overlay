const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const expressApp = require('./src/app');

let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 500,
        height: 350,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        resizable: false,
        transparent: true,
        alwaysOnTop: true, // This will make the window always stay on top
    });

    // Load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization.
app.whenReady().then(() => {
    createWindow();

    // Register a 'Ctrl+Shift+X' shortcut listener.
    const ret = globalShortcut.register('Control+Shift+X', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });

    if (!ret) {
        console.log('Registration failed: Ctrl+Shift+X');
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('Control+Shift+X'));
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Unregister all shortcuts when the application is quitting.
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
