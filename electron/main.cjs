const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path")
const isDev = !app.isPackaged
function createWindow() {
  const window = new BrowserWindow({ width: 440, height: 700, minWidth: 380, minHeight: 620, title: "Calculator", backgroundColor: "#fbf7ef", autoHideMenuBar: true, frame: false, webPreferences: { preload: path.join(__dirname, "preload.cjs"), contextIsolation: true, nodeIntegration: false } })
  if (isDev) window.loadURL("http://127.0.0.1:5173")
  else window.loadFile(path.join(__dirname, "../dist/index.html"))
}
app.whenReady().then(() => { createWindow(); app.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createWindow()) })
ipcMain.on("window-control", (event, action) => { const window = BrowserWindow.fromWebContents(event.sender); if (!window) return; if (action === "minimize") window.minimize(); if (action === "maximize") window.isMaximized() ? window.unmaximize() : window.maximize(); if (action === "close") window.close() })
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit())

