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

function convertSize(size){
    let result = "";
    if (size >= 1024 * 1024 * 1024) {
        result = (size / 1024 / 1024 / 1024).toFixed(2) + " gb";
    }
    else if (size >= 1024 * 1024) {
        result = (size / 1024 / 1024).toFixed(2) + " mb";
    }
    else if (size >= 1024) {
        result = (size / 1024).toFixed(2) + " kb";
    }
    else {
        result = (size).toFixed(2) + " b";
    }
    return result;
}

function sendStatusToWindow(status, params) {
    win.webContents.send(status, params)
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow("updater-message", 'Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow("updater-message", 'New version found.');
});

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow("updater-lastest", 'This is the lastest version.');
});

autoUpdater.on('error', (err) => {
    sendStatusToWindow("updater-error", 'Error in auto-updater.');
});

autoUpdater.on('download-progress', (progressObj) => {
    let speed = convertSize(progressObj.bytesPerSecond) + "/s";
    let transferred = convertSize(progressObj.transferred);
    let total = convertSize(progressObj.total);
    let percent = Math.round(progressObj.percent) + "%";

    let log_message = "Download speed: " + speed;
    log_message = log_message + ' - Downloaded ' + percent;
    log_message = log_message + ' ( ' + transferred + " / " + total + ' )';

    sendStatusToWindow("updater-showProgress", log_message);
});

autoUpdater.on('update-downloaded', (info) => {
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
        autoUpdater.checkForUpdates();
    }
});

//  [Environment]::SetEnvironmentVariable("GH_TOKEN","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","User")