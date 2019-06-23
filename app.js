const {app, BrowserWindow} = require('electron')

let win

function createWindow() {
  win = new BrowserWindow({
    title: 'Project Whiteboard',
    minWidth: 300,
    minHeight: 370,
    width: 770,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('./src/home.html')
  win.webContents.openDevTools() // for developing
  win.removeMenu()
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
