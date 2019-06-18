let projectData = JSON.parse(sessionStorage.projectData)
const timeline = projectData.timeline
const saveFilePath = sessionStorage.saveFilePath

if (timeline.data.length > 0) {
  $('#timeline').empty()
}

timeline.data.forEach((milestone, i) => {
  var item = $('<li></li>').attr({ class: 'milestone' }).text(i + 1)
  var desc = $('<h3></h3>').text(milestone.desc)
  var date = $('<span></span>')
  if (milestone.date !== undefined) {
    date.text(milestone.date)
  } else {
    date.html('<i>TBD</i>')
  }
  $('#timeline').append(item, $('<div></div>').append(desc, date), $('<br>'))
  if (i == timeline.activeIndex) {
    item.attr({ class: 'active milestone' })
  }
})

$(() => {
  $('#timelineLink').addClass('activeLink')
})
