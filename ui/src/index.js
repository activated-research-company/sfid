const electron = require('electron');
const path = require('path');
const lockFile = require('lockfile');

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(process.cwd(), '..', '..', '.env') });
  dotenv.config();
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  require('electron-reload')(__dirname, { electron: __dirname });
}

let mainWindow;

const {
  app,
  BrowserWindow,
  session,
} = electron;

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=3000');

const electronConfig = {
  URL_LAUNCHER_FRAME: process.env.URL_LAUNCHER_FRAME === '1' ? 1 : 0,
  URL_LAUNCHER_KIOSK: process.env.URL_LAUNCHER_KIOSK === '1' ? 1 : 0,
  URL_LAUNCHER_NODE: process.env.URL_LAUNCHER_NODE === '1' ? 1 : 0,
  URL_LAUNCHER_WIDTH: parseInt(process.env.URL_LAUNCHER_WIDTH || 1920, 10),
  URL_LAUNCHER_HEIGHT: parseInt(process.env.URL_LAUNCHER_HEIGHT || 1080, 10),
  URL_LAUNCHER_TITLE: process.env.URL_LAUNCHER_TITLE || 'SFID',
  URL_LAUNCHER_URL: `file:///${path.join(__dirname, '..', 'dist', 'index.html')}`,
  URL_LAUNCHER_OVERLAY_SCROLLBARS: process.env.URL_LAUNCHER_OVERLAY_SCROLLBARS === '1' ? 1 : 0,
  ELECTRON_ENABLE_HW_ACCELERATION: process.env.ELECTRON_ENABLE_HW_ACCELERATION === '1',
  ELECTRON_RESIN_UPDATE_LOCK: process.env.ELECTRON_RESIN_UPDATE_LOCK === '1',
  ELECTRON_APP_DATA_DIR: process.env.ELECTRON_APP_DATA_DIR,
  ELECTRON_USER_DATA_DIR: process.env.ELECTRON_USER_DATA_DIR,
};

if (!electronConfig.ELECTRON_ENABLE_HW_ACCELERATION) { app.disableHardwareAcceleration(); }
if (electronConfig.ELECTRON_APP_DATA_DIR) { electron.app.setPath('appData', electronConfig.ELECTRON_APP_DATA_DIR); }
if (electronConfig.ELECTRON_USER_DATA_DIR) { electron.app.setPath('userData', electronConfig.ELECTRON_USER_DATA_DIR); }

if (process.env.NODE_ENV === 'development') {
  Object.assign(electronConfig, {
    URL_LAUNCHER_KIOSK: 0,
    URL_LAUNCHER_FRAME: 1,
    URL_LAUNCHER_HEIGHT: 600,
    URL_LAUNCHER_WIDTH: 1400,
  });
}

// Listen for a 'resin-update-lock' to either enable, disable or check
// the update lock from the renderer process (i.e. the app)
if (electronConfig.ELECTRON_RESIN_UPDATE_LOCK) {
  electron.ipcMain.on('resin-update-lock', (event, command) => {
    switch (command) {
      case 'lock':
        lockFile.lock('/tmp/resin/resin-updates.lock', (error) => {
          event.sender.send('resin-update-lock', error);
        });
        break;
      case 'unlock':
        lockFile.unlock('/tmp/resin/resin-updates.lock', (error) => {
          event.sender.send('resin-update-lock', error);
        });
        break;
      case 'check':
        lockFile.check('/tmp/resin/resin-updates.lock', (error, isLocked) => {
          event.sender.send('resin-update-lock', error, isLocked);
        });
        break;
      default:
        event.sender.send('resin-update-lock', new Error(`Unknown command "${command}"`));
        break;
    }
  });
}

app.on('ready', () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src \'self\' http: ws: \'unsafe-inline\' \'unsafe-eval\''],
      },
    });
  });

  mainWindow = new BrowserWindow({
    width: electronConfig.URL_LAUNCHER_WIDTH,
    height: electronConfig.URL_LAUNCHER_HEIGHT,
    frame: !!(electronConfig.URL_LAUNCHER_FRAME),
    title: electronConfig.URL_LAUNCHER_TITLE,
    kiosk: !!(electronConfig.URL_LAUNCHER_KIOSK),
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      zoomFactor: 1,
      overlayScrollbars: !!(electronConfig.URL_LAUNCHER_OVERLAY_SCROLLBARS),
    },
  });

  mainWindow.setIcon(electron.nativeImage.createFromPath(path.join(__dirname, '/assets/favicon.ico')));

  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      mainWindow.show();
    }, 300);
  });

  if (process.env.NODE_ENV === 'development' || process.env.DEV_TOOLS === 'true') { mainWindow.webContents.openDevTools(); }

  process.on('uncaughtException', () => {});

  mainWindow.loadURL(electronConfig.URL_LAUNCHER_URL);
});
