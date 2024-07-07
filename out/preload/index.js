"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {};
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
electron.contextBridge.exposeInMainWorld("electron", {
  sendCommand: (command) => electron.ipcRenderer.send("execute-command", command),
  onCommandResult: (callback) => electron.ipcRenderer.on("command-result", callback)
});
