const allowSaving = eval(sessionStorage.allowSaving)

let projectData = JSON.parse(sessionStorage.projectData)
let projectArchive = projectData.archive

function removeArchive(event) {
  var targetArchive
  projectArchive.some((elem, i) => {
    if (elem.hashid == event.data.id) {
      targetArchive = projectArchive.splice(i, 1)[0]
      return true
    }
  })
  if (event.data.reopen) {
    delete targetArchive.date
    delete targetArchive.solution
    projectData.issues.push(targetArchive)
  }
  sessionStorage.projectData = JSON.stringify(projectData)
  allowSaving()
  $('#data-' + event.data.id).remove()
}

if (projectArchive.length > 0) {
  $('#content').empty()
}

projectArchive.forEach((issue) => {
  var container = $('<div></div>').attr({
    class: 'issueDiv',
    id: 'data-' + issue.hashid
  }).append(
    $('<p></p>').text(issue.title).prepend('<b>Title:</b> '),
    $('<p></p>').text(issue.desc).prepend('<b>Description:</b> '),
    $('<p></p>').text(issue.solution).prepend('<b>Solution:</b> '),
    $('<p></p>').text(issue.date).prepend('<b>Date:</b> '),
    $('<button class="optBtn">Options &#9658;</button>').on('click', () => {
      $('#data-' + issue.hashid + ' .options').slideToggle()
      var btn = $('#data-' + issue.hashid + ' .optBtn')
      var symbolCode = btn.html().charCodeAt(btn.html().length - 1)
      if (symbolCode == 9658) {
        btn.html('Options &#9660;')
      } else {
        btn.html('Options &#9658;')
      }
    })
  )
  var options = $('<div class="options"></div>')
  var unarchiveBtn = $('<button>Unarchive</button>').attr({
    title: 'Remove this from the archive and reopen it as an issue.'
  }).on('click', { id: issue.hashid, reopen: true }, removeArchive)
  var delBtn = $('<button class="delBtn">Delete</button>')
    .on('click', { id: issue.hashid, reopen: false }, removeArchive)
  options.append(unarchiveBtn, delBtn).hide()
  container.append(options, $('<hr>'))
  $('#content').append(container)
})

$(() => {
  $('#archiveLink').addClass('activeLink')
})
