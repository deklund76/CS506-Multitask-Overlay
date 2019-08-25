const {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  Menu,
  ipcMain
} = require('electron');
const fs = require('fs-extra');
const Model = require(`${process.cwd()}/src/js/Model/Model.js`);
const Controller = require(`${process.cwd()}/src/js/Controller/Controller.js`);
const addon = require('./build/Release/main.node');

var sys = require('util');
var currentCombo = 'Control+1';
var mouseEvents = true;
module.exports = addon;

let mainWindow;
let win = [];
/* initialize MVC */
let model = new Model();
let disp = false;
const controller = new Controller(model);

function createWidgets(widgetArray, opac) {

  for (let x = 0; x < widgetArray.length; x++) {
    win.push(new BrowserWindow({
      width: parseInt(widgetArray[x].width),
      height: parseInt(widgetArray[x].height),
      x: parseInt(widgetArray[x].left),
      y: parseInt(widgetArray[x].top),
      opacity: opac,
      alwaysOnTop: true,
      frame: false,
      ignoreMouseEvents: true,
      webPreferences: {
        nodeIntegration: true
      }
    }));
    win[x].setAutoHideMenuBar(true);
    win[x].loadFile(widgetArray[x].src);
    win[x].setIgnoreMouseEvents(mouseEvents);


  }
  const shortcut2 = globalShortcut.register(currentCombo, () => {
    win[0].minimize();
  });
  const clickable = globalShortcut.register('Alt+X', () => {
    mouseEvents = !mouseEvents;
    for (let x = 0; x < widgetArray.length; x++) {
      win[x].setIgnoreMouseEvents(mouseEvents);
    }
  });

  const keyCombo = globalShortcut.register('Control+0', () => {
    win[0].show();
  });
  async function background(){
    return new Promise((resolve, rejected) => {
      var temp = addon.hotKeyListener('[CTRL]B');
      if (temp == 1) {
        win[0].minimize();
        resolve();
      } else {
        console.log("Escaped\n")
      }
    });
  }

  win[0].on('show',() => {
    disp=true;
    win[0].focus();
    for (let x = 1; x < widgetArray.length; x++) {
      win[x].show();
    }
    //return background();

  })


  win[0].on('minimize', function(event) {
    disp=false;
    event.preventDefault();
    for (let x = 0; x < widgetArray.length; x++) {
      win[x].hide();
    }
    let temp = addon.hotKeyListener('[CTRL]B');
    if (temp == 1) {
      win[0].show();
    } else {
      console.log("Escaped\n")
    }
  });
  /*let timerId = setInterval(() => {
    console.log("Bunny");
    win[0].show();
  }, 2000)*/

}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: './src/images/KOLogo.png',
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.setResizable(false);
  mainWindow.setMenu(null);
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.loadFile('./src/html/mainApp.html');
  var appIcon = new Tray('./src/images/KOLogo.png')
  var contextMenu = Menu.buildFromTemplate([{
      label: 'Show App',
      click: function() {
        mainWindow.show()
      }
    },
    {
      label: 'Quit',
      click: function() {
        app.isQuiting = true
        //const remote = require('electron').remote;
        //  let w = remote.getCurrentWindow()
        mainWindow._events.closed()
        app.quit()
      }
    }
  ])
  appIcon.setContextMenu(contextMenu);

  mainWindow.on('minimize', function(event) {
    event.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('show', function() {
    appIcon.setHighlightMode('always')
    mainWindow.focus();
  })
  mainWindow.on('closed', function() {
    mainWindow = null;
    process.exit();
    return false;
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

/* open overlay */
ipcMain.on('openOverlay', () => {
  if (win.length !== 0) {
    for (let x = 0; x < win.length; x++) {
      win[x].close();
    }
    win = [];
  }
  let widgetArray = model.preset.widgetList;

  for (let x = 0; x < widgetArray.length; x++) {
    if (widgetArray[x].type == 'noteWidget') {
      widgetArray[x].src = '../Overlay/src/html/testNotepad.html';
    }
    if (widgetArray[x].type == 'browserWidget') {
      widgetArray[x].src = '../Overlay/src/html/browser.html';
    }

    widgetArray[x].height = widgetArray[x].height * 1080;
    widgetArray[x].width = widgetArray[x].width * 1920;
    widgetArray[x].left = widgetArray[x].left * 1920;
    widgetArray[x].top = widgetArray[x].top * 1080;

  }
  createWidgets(widgetArray, model.preset.opacity);
  for (let x = 0; x < widgetArray.length; x++) {
    widgetArray[x].height = widgetArray[x].height / 1080;
    widgetArray[x].width = widgetArray[x].width / 1920;
    widgetArray[x].left = widgetArray[x].left / 1920;
    widgetArray[x].top = widgetArray[x].top / 1080;

  }
});

app.on('ready', createWindow);

app.on('ready', () => {
  globalShortcut.register('Escape', () => {
    mainWindow.loadFile('./src/html/mainApp.html');
  });
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('initialize');
  });
});

function changeKeyCombo(newCombo) {
  globalShortcut.unregister(currentCombo);
  currentCombo = newCombo;
  keyCombo = globalShortcut.register(newCombo, () => {
    mainWindow.show();
    mainWindow.alwaysOnTop = true;
  })
  if (!keyCombo) {
    console.log('registration failed')
  }
}

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
