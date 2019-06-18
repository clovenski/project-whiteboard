sessionStorage.allowSaving = () => {
  sessionStorage.changesMade = true
  $('#saveBtn, #saveAsBtn').removeClass('activeLink')
  var btnFunc = () => {
    require('fs').writeFileSync(
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
var homeLink = $('<a>HOME</a>').attr({ href: './home.html' })
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
