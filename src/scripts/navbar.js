// func to allow saving
sessionStorage.allowSaving = () => {
  sessionStorage.changesMade = true
  $('#saveBtn, #saveAsBtn').removeClass('activeLink')
  var btnFunc = (e) => {
    const fs = require('fs')
    e.preventDefault()
    // create project dir if not exists
    if (!fs.existsSync(sessionStorage.projDir)) {
      fs.mkdirSync(sessionStorage.projDir, { recursive: true })
    }
    fs.writeFileSync(
      sessionStorage.saveFilePath,
      JSON.stringify(JSON.parse(sessionStorage.projectData), null, 2)
    )
    $('#saveBtn').addClass('activeLink')
    sessionStorage.changesMade = false
    sessionStorage.saveFunc = undefined
  }
  $('#saveBtn').on('click', btnFunc)
  sessionStorage.saveFunc = btnFunc
}

var navbar = $('<div></div>').attr({ id: 'navbar' })
var homeLink = $('<a>HOME</a>').attr({ href: '#' })
var saveBtn = $('<a id="saveBtn" href="#">SAVE</a>')
var infoLink = $('<a>INFO</a>').attr({
  id: 'infoLink',
  href: './info.html'
})
var resLink = $('<a>RESOURCES</a>').attr({
  id: 'resLink',
  href: './res.html'
})
var timelineLink = $('<a>TIMELINE</a>').attr({
  id: 'timelineLink',
  href: './timeline.html'
})
var todoLink = $('<a>TASKS</a>').attr({
  id: 'tasksLink',
  href: './tasks.html'
})
var issuesLink = $('<a>ISSUES</a>').attr({
  id: 'issuesLink',
  href: './issues.html'
})
var archiveLink = $('<a>ARCHIVE</a>').attr({
  id: 'archiveLink',
  href: './archive.html'
})

navbar.append(
  homeLink, saveBtn, infoLink, resLink, timelineLink,
  todoLink, issuesLink, archiveLink
)

// func to handle unsaved changes
//   return 0 to save, 1 to not save,
//   2 to cancel the exit
function savingBeforeExit() {
  if (eval(sessionStorage.changesMade)) {
    let dialog = require('electron').remote.dialog
    return dialog.showMessageBox({
      type: 'question',
      message: 'Save before exiting?',
      detail: 'testing',
      buttons: ['Save', 'Don\'t save', 'Cancel']
    })
  } else { return undefined }
}

// home button func
homeLink.on('click', (e) => {
  e.preventDefault()
  let resp = savingBeforeExit()
  if (resp == 0) { // save
    $('#saveBtn').trigger('click')
  } else if (resp == 2) { // cancel
    return
  }
  window.location = './home.html'
})

// link for publishing the project
var publishLink = $('<a>PUBLISH</a>').attr({
  id: 'publishLink',
  href: '#'
})
publishLink.on('click', (e) => {
  e.preventDefault()
  let jsCodePath = './src/scripts/publish.js'
  let remote = require('electron').remote
  let win = new remote.BrowserWindow({
    parent: remote.getCurrentWindow(),
    modal: true,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.removeMenu()
  // win.webContents.openDevTools() // for developing
  require('fs').readFile(jsCodePath, 'utf-8', (err, data) => {
    if (err) throw err
    let projectData = sessionStorage.projectData
    win.webContents.executeJavaScript(`const projectData=${projectData}`)
      .then(() => { win.webContents.executeJavaScript(data) })
  })
  win.loadURL(`file://${__dirname}/publish.html`)
  win.on('ready-to-show', () => { win.show() })
})
navbar.append(publishLink)

$(() => {
  $(document.body).prepend(navbar)
  // if changes were not made, hide save button
  if (!eval(sessionStorage.changesMade)) {
    $('#saveBtn').addClass('activeLink')
  }
  // persist the func for save btn if user did not save before changing pages
  if (typeof(eval(sessionStorage.saveFunc) == 'function')) {
    $('#saveBtn').on('click', eval(sessionStorage.saveFunc))
  }
})
