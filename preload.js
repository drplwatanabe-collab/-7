const { contextBridge, ipcRenderer } = require('electron');

// レンダラー側に安全なAPIを公開
contextBridge.exposeInMainWorld('electronAPI', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  isElectron: true,
});
