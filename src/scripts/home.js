const fs = require('fs')
const path = require('path')
const projectsDir = path.join(__dirname + '/../projects/')

// default data of a new project
var projectData = {
  info: {
    name: 'untitled',
    body: []
  },
  resources: [],
  timeline: {
    activeID: null,
    data: []
  },
  tasks: [],
  issues: [],
  archive: []
}

$('#newBtn').on('click', () => {
  // TODO: prompt for project name first, along with author name
  var projDir = path.join(projectsDir + projectData.info.name + '/')
  sessionStorage.projDir = projDir
  sessionStorage.saveFilePath = projDir + projectData.info.name + '.json'
  sessionStorage.projectData = JSON.stringify(projectData)
  sessionStorage.changesMade = false
  window.location = 'info.html'
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
    alert('No projects detected in directory: ' + projectsDir)
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
