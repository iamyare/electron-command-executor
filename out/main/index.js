"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const child_process = require("child_process");
const os = require("os");
const supabaseJs = require("@supabase/supabase-js");
const icon = path.join(__dirname, "../../resources/icon.png");
const supabaseUrl = "https://qcwdivuxddjokidadogy.supabase.co;";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd2RpdnV4ZGRqb2tpZGFkb2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTgxNjEsImV4cCI6MjAzMjIzNDE2MX0.HnggSDy5m-3G7uRN0xQ1sJhXHyAODqMKGQ4dmS8Q-ZE";
supabaseJs.createClient(supabaseUrl, supabaseKey);
function getMAC() {
  let macAddress = "";
  for (const interfaceKey in os.networkInterfaces()) {
    const networkInterface = os.networkInterfaces()[interfaceKey];
    const nonInternalInterface = networkInterface?.find(
      (net) => !net.internal
    );
    if (nonInternalInterface) {
      macAddress = nonInternalInterface.mac;
      break;
    }
  }
  return macAddress;
}
function getDeviceNameLocal() {
  return os.userInfo().username;
}
let mainWindow;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    center: true,
    title: "Command Executor",
    vibrancy: "under-window",
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    visualEffectState: "active",
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.ipcMain.on("execute-command", (event, command) => {
    child_process.exec(command, (error, stdout, stderr) => {
      let status = "completed";
      let output = stdout;
      if (error) {
        status = "error";
        output = error.message;
      } else if (stderr) {
        status = "stderr";
        output = stderr;
      }
      event.reply("command-result", JSON.stringify({ status, output }));
    });
  });
  electron.ipcMain.on("get-info-device-local", (event) => {
    const MAC = getMAC();
    const DEVICE_NAME_LOCAL = getDeviceNameLocal();
    const OS = process.platform;
    event.reply("info-device-local", JSON.stringify({ mac: MAC, name: DEVICE_NAME_LOCAL, os: OS }));
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
