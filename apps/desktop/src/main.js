const { app, BrowserWindow } = require("electron");
const path = require("path");
const http = require("http");
const serveHandler = require("serve-handler");

const isDev = !app.isPackaged;
const DEV_URL = process.env.ELECTRON_RENDERER_URL || "http://localhost:3000";

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      // 보안 기본값
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js") // 필요 시 사용
    }
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // 앱 리소스에 포함된 out 폴더를 정적 서버로 서빙
    const outDir = path.join(process.resourcesPath, "web-out");
    const server = http.createServer((req, res) =>
      serveHandler(req, res, { public: outDir })
    );
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      win.loadURL(`http://127.0.0.1:${port}`);
    });
  }

  win.on("closed", () => (win = null));
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
