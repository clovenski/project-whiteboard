const fs = require('fs')
const projectsDir = __dirname + '/../projects/'

var projectData = {}

$('#newBtn').click(() => { $('#new form').fadeToggle() })

$('#new form').submit((e) => {
  e.preventDefault()
  var name = $('#new form input').val()
  projectData.info.name = name
  sessionStorage.projectData = JSON.stringify(projectData)
  window.location = 'info.html'
})

$('#loadBtn').click(() => {
  // prompt for project to load (json file)
  // load project data into projectData and sessionStorage.projectData
  // redirect to info.html

  // if previously clicked, remove already present project buttons 
  if ($('#loadBtns').length != 0) {
    $('#loadBtns').remove()
  }

  try {
    var projects = fs.readdirSync(projectsDir)
  } catch (err) {
    console.log('no projects detected')
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
      $(btn).click(() => {
        $.getJSON(projectsDir + name + '/' + name + '.json', (data) => {
          sessionStorage.projectData = JSON.stringify(data)
          window.location = 'info.html'
        })
      })
    })
    $('.loadProjBtn').fadeIn()
  } else {
    console.log('no projects detected')
  }
})

$('body').hide()
$(document).ready(() => {
  $('body').fadeIn()
})