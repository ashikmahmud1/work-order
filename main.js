const {app, BrowserWindow} = require('electron');
const electron = require('electron');
const path = require('path');
const url = require('url');

///////////////////////////////////

const fs = require('fs');
const os = require('os');
const ipc = electron.ipcMain;
const shell = electron.shell;

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1350,
    height: 800,
    minWidth: 1350,
    minHeight: 800
  });

  // load the dist folder from Angular
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/workorder/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools optionally:
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});
ipc.on('print-to-pdf', function (event) {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf');
  const win = BrowserWindow.fromWebContents(event.sender);
  win.webContents.printToPDF({}, function (error, data) {
    if (error){
      console.log(error.message);
    }
    else {
      fs.writeFile(pdfPath, data, function (err) {
        if (err){
          event.sender.send('error',err);
        }
        else {
          shell.openExternal('file://' + pdfPath);
          event.sender.send('wrote-pdf', pdfPath);
        }
      })
    }
  })
});
ipc.on('export-data', function (event, data) {

  //write the data to the text file
  let json = JSON.stringify(data);
  const dbPath = path.join(app.getAppPath(), 'db/backup.json');
  //First check file exist or not. If file doesn't exists then create the file and then Write.
  fs.writeFile(dbPath, json, 'utf8', function (err) {
    if (err) {
      //send export-unsuccessful
      console.log(err);
    }
    else {
      message = "Data successfully exported";
      event.sender.send('export-successful',message);
    }
  });
});

ipc.on('import-data', function (event) {
  const dbPath = path.join(app.getAppPath(), 'db/backup.json');
  fs.readFile(dbPath, 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      let obj = null;
      if( data !== "" ){
        obj = JSON.parse(data); //now it an object
      }
      event.sender.send('imported-data', obj);
    }
  });
});
