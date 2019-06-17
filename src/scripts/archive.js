let projectArchive = JSON.parse(sessionStorage.projectData).archive

projectArchive.forEach((issue) => {
  var container = $('<div></div>').attr({
    class: 'issueDiv',
    id: 'data-' + issue.hashid
  }).append(
    $('<p></p>').html('<b>Title:</b> ' + issue.title),
    $('<p></p>').html('<b>Description:</b> ' + issue.desc),
    $('<p></p>').html('<b>Notes:</b> ' + issue.notes),
    $('<p></p>').html('<b>Solution:</b> ' + issue.solution),
    $('<p></p>').html('<b>Date:</b> ' + issue.date)
  )
  $('#content').append(container, $('<hr>'))
})

$(() => {
  $('#archiveLink').addClass('activeLink')
})
