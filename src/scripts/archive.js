const fs = require('fs')

let projectData = JSON.parse(sessionStorage.projectData)
let projectArchive = projectData.archive
const projDir = __dirname + '/../projects/' + projectData.info.name + '/'
const saveFilePath = projDir + projectData.info.name + '.json'

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
  fs.writeFileSync(saveFilePath, JSON.stringify(projectData, null, 2))
  $('#data-' + event.data.id).remove()
}

projectArchive.forEach((issue) => {
  var container = $('<div></div>').attr({
    class: 'issueDiv',
    id: 'data-' + issue.hashid
  }).append(
    $('<p></p>').html('<b>Title:</b> ' + issue.title),
    $('<p></p>').html('<b>Description:</b> ' + issue.desc),
    $('<p></p>').html('<b>Notes:</b> ' + issue.notes),
    $('<p></p>').html('<b>Solution:</b> ' + issue.solution),
    $('<p></p>').html('<b>Date:</b> ' + issue.date),
    $('<button class="optBtn">&#9658; Options</button>').on('click', () => {
      $('#data-' + issue.hashid + ' .options').slideToggle()
      var btn = $('#data-' + issue.hashid + ' .optBtn')
      var symbolCode = btn.html().charCodeAt(0)
      if (symbolCode == 9658) {
        btn.html('&#9660; Options')
      } else {
        btn.html('&#9658; Options')
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
