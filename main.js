const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// データ保存先（ユーザーのAppData）
const dataPath = path.join(app.getPath('userData'), 'salon-data.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 780,
    minWidth: 800,
    minHeight: 600,
    title: 'サロン売上管理ダッシュボード',
    backgroundColor: '#f0efeb',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    // macOS用タイトルバー
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
  });

  // Supabase通信を許可するCSPを設定
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
        ]
      }
    });
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));

  // 準備できたら表示（白フラッシュ防止）
  win.once('ready-to-show', () => win.show());

  // 外部リンクはブラウザで開く
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// データ読み書きのIPCハンドラ
ipcMain.handle('load-data', () => {
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
  } catch (e) {}
  return null;
});

ipcMain.handle('save-data', (_, data) => {
  try {
    // 一時ファイルに書いてからリネーム（書き込み中クラッシュでデータ破損を防ぐ）
    const tmpPath = dataPath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, dataPath);
    return true;
  } catch (e) {
    console.error('save-data error:', e);
    return false;
  }
});

// メニュー設定
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu', label: 'アプリ' }] : []),
    {
      label: 'ファイル',
      submenu: [
        isMac ? { role: 'close', label: '閉じる' } : { role: 'quit', label: '終了' }
      ]
    },
    {
      label: '編集',
      submenu: [
        { role: 'undo', label: '元に戻す' },
        { role: 'redo', label: 'やり直す' },
        { type: 'separator' },
        { role: 'cut', label: 'カット' },
        { role: 'copy', label: 'コピー' },
        { role: 'paste', label: 'ペースト' },
      ]
    },
    {
      label: '表示',
      submenu: [
        { role: 'reload', label: '再読み込み' },
        { type: 'separator' },
        { role: 'zoomIn', label: '拡大' },
        { role: 'zoomOut', label: '縮小' },
        { role: 'resetZoom', label: '標準サイズ' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'フルスクリーン' },
      ]
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
