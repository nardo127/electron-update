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
    sendStatusToWindow("updater-message", 'Checking for update...');
});

autoUpdater.on('update-available', (ev, info) => {
    sendStatusToWindow("updater-message", 'New version found.');
});

autoUpdater.on('update-not-available', (ev, info) => {
    sendStatusToWindow("updater-lastest", 'This is the lastest version. Returning to login page ...');
});

autoUpdater.on('error', (ev, err) => {
    sendStatusToWindow("updater-error", 'Error in auto-updater.');
});

autoUpdater.on('download-progress', (ev, progressObj) => {
    sendStatusToWindow("updater-showProgress", progressObj);
});

autoUpdater.on('update-downloaded', (ev, info) => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 5 seconds.
    // You could call autoUpdater.quitAndInstall(); immediately
    setTimeout(function () {
        autoUpdater.quitAndInstall();
    }, 1000)
})

ipcMain.on('getVersion', (event, text) => {
    sendStatusToWindow('setVersion', app.getVersion());
});

ipcMain.on('checkUpdate', (event, text) => {
    if (isDev) {
        //event.reply('notUpdate')
        sendStatusToWindow("updater-notUpdate", '');
    }
    else {
        //sendStatusToWindow("message", isDev);
        autoUpdater.checkForUpdatesAndNotify();
    }
});

//  [Environment]::SetEnvironmentVariable("GH_TOKEN","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","User")