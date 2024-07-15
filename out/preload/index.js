"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  sendCommand: (command) => electron.ipcRenderer.send("execute-command", command),
  onCommandResult: (callback) => electron.ipcRenderer.on("command-result", callback),
  getInfoDeviceLocal: () => electron.ipcRenderer.send("get-info-device-local"),
  onInfoDeviceLocal: (callback) => electron.ipcRenderer.on("info-device-local", (event, result) => callback(event, result))
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
electron.contextBridge.exposeInMainWorld("api", api);
