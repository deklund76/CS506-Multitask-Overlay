const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const Model = require(`${process.cwd()}/src/js/Model/Model.js`);
const Controller = require(`${process.cwd()}/src/js/Controller/Controller.js`);

let mainWindow;

/* initialize MVC */
const model = new Model();
const controller = new Controller(model);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setResizable(false);

  mainWindow.loadFile('./src/html/mainApp.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/* Controller stuff */
ipcMain.on('initialize', (event) => controller.initialize(event));
ipcMain.on('updateOpacity', (event, opacity) => controller.updateOpacity(opacity));
ipcMain.on('selectBackground', (event, id) => controller.selectBackground(mainWindow, id));
ipcMain.on('selectThisPreset', (event, id) => controller.selectPreset(id));
ipcMain.on('reload', () => mainWindow.reload());
ipcMain.on('savePreset', () => controller.savePreset());
ipcMain.on('renamePreset', (event, newName) => controller.renamePreset(newName, mainWindow));
ipcMain.on('duplicatePreset', () => controller.duplicatePreset(mainWindow));
ipcMain.on('loadPreset', () => controller.loadPreset());
ipcMain.on('deletePreset', (event) => controller.deletePreset(event));
ipcMain.on('createPreset', () => controller.createPreset(mainWindow));
ipcMain.on('updateWidgets', (event, args) => controller.updateWidgets(args));
ipcMain.on('loadWidgets', (event, preview) => controller.loadWidgets(event, preview));

app.on('ready', createWindow);

app.on('ready', () => {
  globalShortcut.register('Escape', () => {
    mainWindow.loadFile('./src/html/mainApp.html');
  });
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('initialize');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
