const fs = require('fs')
const path = require('path')
const dialog = require('electron').remote.dialog
const app = require('electron').remote.app
const projectsDir = path.join(app.getPath('userData'), 'projects/')

// today's date, ex. 8/10/1999
var today = new Date()
today = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`

// default data of a new project
var projectData = {
  info: {
    name: 'untitled', // placeholder, expected to be overwritten
    author: '',
    body: []
  },
  resources: [],
  timeline: {
    activeID: 0,
    data: [
      {
        hashid: 0,
        desc: 'Project started',
        date: today
      }
    ]
  },
  tasks: [],
  issues: [],
  archive: []
}

$('#newBtn').on('click', () => {
  // toggle showing input and button for creating a new project
  $('#createDiv').slideToggle()
})
$('#createDiv').hide()

$('#createBtn').on('click', () => {
  let projName = $('#createDiv #projNameInput').val()
  if (projName != '') {
    sessionStorage.projDir = projectsDir
    sessionStorage.saveFilePath = path.join(projectsDir, projName + '.json')
    projectData.info.name = projName

    sessionStorage.projectData = JSON.stringify(projectData)
    sessionStorage.changesMade = false
    window.location = 'info.html'
  }
})

$('#loadBtn').on('click', () => {
  // display buttons for all found projects

  // if previously clicked, remove already present project buttons
  if ($('#loadBtns').length != 0) {
    $('#loadBtns').remove()
  }

  try {
    var projects = fs.readdirSync(projectsDir)
  } catch (err) {
    dialog.showMessageBox({
      type: 'error',
      message: 'No projects detected in directory:',
      detail: projectsDir
    })
    return
  }
  projects.forEach((name, index) => {
    // check if file is a json file
    if (!name.endsWith('.json')) {
      delete projects[index]
    } else {
      // discard the .json file extension
      projects[index] = name.substring(0, name.length - 5)
    }
  })
  if (projects.length != 0) {
    $('#load').append($('<div></div>').attr({ id: 'loadBtns' }))
    projects.forEach((name) => {
      // append load project button to 'load' div
      var btn = $('<button></button>').attr({
        class: 'loadProjBtn',
        id: name,
        style: 'display:none'
      }).text(name)
      $('#loadBtns').append(btn)
  
      // add onclick event listener
      btn.on('click', () => {
        let filePath = path.join(projectsDir, name + '.json')
        $.getJSON(filePath, (data) => {
          sessionStorage.projDir = projectsDir
          sessionStorage.saveFilePath = filePath
          sessionStorage.projectData = JSON.stringify(data)
          sessionStorage.changesMade = false
          window.location = 'info.html'
        })
      })
    })
    $('.loadProjBtn').fadeIn()
  } else {
    dialog.showMessageBox({
      type: 'error',
      message: 'No projects detected in directory:',
      detail: projectsDir
    })
  }
}) // end loadBtn onclick

$('#delBtn').on('click', () => {
  // display buttons to delete a project

  // if previously clicked, remove already present project buttons
  if ($('#delBtns').length != 0) {
    $('#delBtns').remove()
  }

  try {
    var projects = fs.readdirSync(projectsDir)
  } catch (err) {
    dialog.showMessageBox({
      type: 'error',
      message: 'No projects detected in directory:',
      detail: projectsDir
    })
    return
  }
  projects.forEach((name, index) => {
    // check if file is a json file
    if (!name.endsWith('.json')) {
      delete projects[index]
    } else {
      // discard the .json file extension
      projects[index] = name.substring(0, name.length - 5)
    }
  })
  if (projects.length != 0) {
    $('#delete').append($('<div></div>').attr({ id: 'delBtns' }))
    projects.forEach((name) => {
      // append load project button to 'load' div
      var btn = $('<button></button>').attr({
        class: 'delProjBtn',
        id: name,
        style: 'display:none'
      }).text(name)
      $('#delBtns').append(btn)
  
      // add onclick event listener
      btn.on('click', () => {
        fs.unlinkSync(path.join(projectsDir, name + '.json'))
        $(`#loadBtns #${name}`).remove()
        btn.remove()
      })
    })
    $('.delProjBtn').fadeIn()
  } else {
    dialog.showMessageBox({
      type: 'error',
      message: 'No projects detected in directory:',
      detail: projectsDir
    })
  }
}) // end delBtn on click

$(() => {
  $('#navbar a').addClass('activeLink')
})
