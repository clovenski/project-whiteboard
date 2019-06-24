const fs = require('fs')
const path = require('path')
const dialog = require('electron').remote.dialog
const projectsDir = path.join(__dirname + '/../projects/')

// today's date, ex. 8/10/1999
var today = new Date()
today = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`

// default data of a new project
var projectData = {
  info: {
    name: 'untitled', //placeholder, expected to be overwritten
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
    var projDir = path.join(projectsDir + projName + '/')
    sessionStorage.projDir = projDir
    sessionStorage.saveFilePath = projDir + projName + '.json'
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
    // alert('No projects detected in directory: ' + projectsDir)
    dialog.showMessageBox({
      type: 'error',
      message: 'No projects detected in directory: ' + projectsDir
    })
    return
  }
  projects.forEach((name, index) => {
    // check if json file exists in the project directory
    var filePath = projectsDir + name + '/' + name + '.json'
    if (!fs.existsSync(filePath)) {
      delete projects[index]
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
      $(btn).on('click', () => {
        $.getJSON(projectsDir + name + '/' + name + '.json', (data) => {
          var projDir = path.join(projectsDir + data.info.name + '/')
          sessionStorage.projDir = projDir
          sessionStorage.saveFilePath = projDir + data.info.name + '.json'
          sessionStorage.projectData = JSON.stringify(data)
          sessionStorage.changesMade = false
          window.location = 'info.html'
        })
      })
    })
    $('.loadProjBtn').fadeIn()
  } else {
    alert('No projects detected in directory: ' + projectsDir)
  }
}) // end loadBtn onclick

$(() => {
  $('#navbar a').addClass('activeLink')
})
