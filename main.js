const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev")

var win;

function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile('./checkUpdate.html')
}

app.whenReady().then(() => {
    createWindow()
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

function sendStatusToWindow(status, params) {
    win.webContents.send(status, params)
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow("message", 'Checking for update...');
});

autoUpdater.on('update-available', (ev, info) => {
    sendStatusToWindow("message", 'Update available.');
});

autoUpdater.on('update-not-available', (ev, info) => {
    sendStatusToWindow("message", 'Update not available.');
});

autoUpdater.on('error', (ev, err) => {
    sendStatusToWindow("message", 'Error in auto-updater.');
});

autoUpdater.on('download-progress', (ev, progressObj) => {
    sendStatusToWindow("message", 'Download progress...');
});

autoUpdater.on('update-downloaded', (ev, info) => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 5 seconds.
    // You could call autoUpdater.quitAndInstall(); immediately
    setTimeout(function () {
        autoUpdater.quitAndInstall();
    }, 5000)
})

ipcMain.on('getVersion', (event, text) => {
    event.reply('setVersion', app.getVersion());
});

ipcMain.on('checkUpdate', (event, text) => {
    if (isDev) {
        //event.reply('notUpdate')
        sendStatusToWindow("message", 'notUpdate');
    }
    else {
        //sendStatusToWindow("message", isDev);
        autoUpdater.checkForUpdates();
    }
});