const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
let discoSpeed = 1000;
//const yeelightDir = path.join(__dirname, '../', `y-scripts`);

let yeelightDir;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

ipcMain.on('script-dir-setup',(e,value)=>{
    yeelightDir = value;
    e.returnValue = "";
})

ipcMain.on('toggle-bulb', () => {
    if (!yeelightDir){
        return
    }
    exec(`${yeelightDir}/yeelight-toggle.sh 0`, (err, stdout, stderr) => {
        console.log(`err`, err)
        console.log(`stdout:`, stdout)
        console.log(`std-err:`, stderr)
    })
})

ipcMain.on('change-brightness', (e, value) => {
    if (!yeelightDir){
        return
    }
    exec(`${yeelightDir}/yeelight-brightness.sh 0 ${value}`, (err, stdout, stderr) => {
        console.log(`err`, err)
        console.log(`stdout:`, stdout)
        console.log(`std-err:`, stderr)
    })
})

ipcMain.on('set-scene', (e, scene) => {
    if (!yeelightDir){
        return
    }
    if (scene == 'DISCO') {
        exec(`DISCOSPEED=900 ${yeelightDir}/yeelight-scene.sh 0 ${scene}`, (err, stdout, stderr) => {
            console.log(`err`, err)
            console.log(`stdout:`, stdout)
            console.log(`std-err:`, stderr)
        })
    } else {
        exec(`${yeelightDir}/yeelight-scene.sh 0 ${scene}`, (err, stdout, stderr) => {
            if (!yeelightDir){
                return
            }
            console.log(`err`, err)
            console.log(`stdout:`, stdout)
            console.log(`std-err:`, stderr)
        })
    }

})

ipcMain.on('request-script-dir', async (e) => {
    const result = await dialog.showOpenDialog(null, {
        properties: ["openDirectory"]
    });
    console.log(`directories selected `, result.filePaths);
    e.returnValue = result.filePaths;
    if (result.filePaths.length){
        yeelightDir = result.filePaths[0]
    }
})

ipcMain.on('set-disco-speed', (e, value) => {
    if (isNaN(value)) {
        console.log('speed not a number')
        // @TODO - Maybe send an error back
    }
    discoSpeed = Math.abs(value)
})

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Smart Bulb',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
