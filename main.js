const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

const os = require('os');
const networkInterfaces = require('os').networkInterfaces();

// Obtener el nombre del usuario actual
const usuario = os.userInfo().username;

// Obtener la dirección MAC
// Nota: Esto obtendrá la dirección MAC de la primera interfaz de red encontrada que no sea interna.
let macAddress = '';
for (let interfaceKey in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceKey];
    const nonInternalInterface = networkInterface.find(net => !net.internal);
    if (nonInternalInterface) {
        macAddress = nonInternalInterface.mac;
        break;
    }
}


// Obtener el sistema operativo
const sistemaOperativo = `${os.type()} ${os.release()}`;
console.log(`Usuario: ${usuario}`);
console.log(`Dirección MAC: ${macAddress}`);
console.log(`Sistema Operativo: ${sistemaOperativo}`);

const SUPABASE_URL = 'https://qcwdivuxddjokidadogy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd2RpdnV4ZGRqb2tpZGFkb2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTgxNjEsImV4cCI6MjAzMjIzNDE2MX0.HnggSDy5m-3G7uRN0xQ1sJhXHyAODqMKGQ4dmS8Q-ZE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Escuchar eventos de Supabase
  const userId = '6428ab79-6446-4b1f-a968-6d2246426728'; // Reemplaza con el ID del usuario actual
  supabase
    .channel('command-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'command_history', filter: `user_id=eq.${userId}` }, async payload => {
      const commandId = payload.new.command_id;
      const { data: commandData, error } = await supabase
        .from('commands')
        .select('command')
        .eq('id', commandId)
        .single();

      if (error) {
        console.error('Error fetching command:', error);
        return;
      }

      const command = commandData.command;
      exec(command, async (error, stdout, stderr) => {
        let status = 'completed';
        let output = stdout;

        if (error) {
          status = 'error';
          output = error.message;
        } else if (stderr) {
          status = 'stderr';
          output = stderr;
        }

        await supabase
          .from('command_history')
          .update({ status, output, updated_at: new Date() })
          .eq('id', payload.new.id);

        mainWindow.webContents.send('command-result', JSON.stringify({ status: status, output: output }));
      });
    })
    .subscribe();


    //obtener datos del sistema actual desde nodejs

});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});