/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
// import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { getUserFromLocalStorage } from './utils/User';
// import GamenerdzWorker from './workers/gamenerdz';
import WorkerAgent from './workers/workerAgent';


const CHANNELS = require('./constants/channels.json');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    // autoUpdater.logger = log;
    // autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let loginWindow: BrowserWindow | null = null;


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createMainWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1228,
    height: 760,
    minHeight: 760,
    minWidth: 1228,
    frame: true,
    resizable: true,
    maximizable: true,
    movable: true,
    autoHideMenuBar: true,
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
          nodeIntegration: true,
          enableRemoteModule: true
        }
        : {
          preload: path.join(__dirname, 'dist/renderer.prod.js'),
          enableRemoteModule: true
        }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};


const createLoginWindow = async () => {

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  loginWindow = new BrowserWindow({
    show: false,
    width: 640,
    height: 375,
    minHeight: 375,
    minWidth: 640,
    maxHeight: 375,
    maxWidth: 640,
    frame: false,
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
          nodeIntegration: true,
          enableRemoteModule: true
        }
        : {
          preload: path.join(__dirname, 'dist/renderer.prod.js'),
          enableRemoteModule: true
        }
  });

  loginWindow.loadURL(`file://${__dirname}/app.html#/auth`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  loginWindow.webContents.on('did-finish-load', () => {
    if (!loginWindow) {
      throw new Error('LoginWindow is not defined');
    }
    if (process.env.START_MINIMIZED) {
      loginWindow.minimize();
    } else {
      loginWindow.show();
      loginWindow.focus();
    }
  });

  loginWindow.on('closed', () => {
    loginWindow = null;
  });

  const menuBuilder = new MenuBuilder(loginWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createMainWindow);
} else {
  app.on('ready', async () => {
    await auth();
  });
}

const auth = async () => {
  let userData = await getUserFromLocalStorage();
  console.log('settings', userData);
  let auth_status = false;
  if (auth_status) {
    console.log('auth status', auth_status);
    await createMainWindow();
  } else {
    console.log('auth status', auth_status);
    await createLoginWindow();
  }
};

ipcMain.on('activated', async () => {
  await createMainWindow();
  if (loginWindow) {
    loginWindow.close();
    loginWindow = null;
  }

});

ipcMain.on('quit-app', () => {
  console.log('app quit--background');
  app.quit();

});


ipcMain.on('hide-app', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
  if (loginWindow) {
    loginWindow.minimize();
  }
});


app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createLoginWindow();
  }
  // if (mainWindow === null) createMainWindow();
});


// worker process
const notifyTaskUpdated = (taskId: string, status: any) => {
  if (mainWindow)
    mainWindow.webContents.send(CHANNELS.NOTIFY_TASK_STATUS, { taskId, status });
};


ipcMain.on(CHANNELS.START_TASK, (event, args) => {
  // console.log(event, args);
  let { task } = args;
  console.log('START_TASK_ON :', CHANNELS.START_TASK, task.id);
  task.fnUpdateStatus = notifyTaskUpdated;
  const res = WorkerAgent.attachTask(task);
  console.log('START_TASK_RES:', res);
  event.returnValue = res;
});

ipcMain.on(CHANNELS.STOP_TASK, (event, args) => {
  // console.log(event, args);
  let { task } = args;
  console.log('_STOP_TASK_ON :', CHANNELS.STOP_TASK, task.id);
  task.fnUpdateStatus = notifyTaskUpdated;
  const res = WorkerAgent.detachTask(task);
  console.log('_STOP_TASK_RES:', res);
  event.returnValue = res; // { success: true, message: 'Successfully requested' };
});


ipcMain.on(CHANNELS.SUBSCRIBE_TASKS_STATUS, (event, args) => {
  console.log('ON:', CHANNELS.SUBSCRIBE_TASKS_STATUS, args);
  const res = WorkerAgent.getTasksStatus();
  console.log('RE:', CHANNELS.SUBSCRIBE_TASKS_STATUS, res);
  event.returnValue = res;
});
