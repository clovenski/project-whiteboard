var navbar = $('<div></div>').attr({ id: 'navbar' })
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
  infoLink, resLink, timelineLink,
  todoLink, issuesLink, archiveLink
)
$(() => {
  $(document.body).prepend(navbar)
})
