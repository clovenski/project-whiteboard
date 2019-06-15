let projectData = JSON.parse(sessionStorage.projectData)
const timeline = projectData.timeline

timeline.data.forEach((milestone, i) => {
  var item = $('<li></li>').attr({ class: 'milestone' }).html(i + 1)
  var desc = $('<h3></h3>').html(milestone.desc)
  var date = $('<span></span>').html(
    milestone.date !== undefined ? milestone.date : '<i>TBD</i>'
  )
  $('#timeline').append(item, $('<div></div>').append(desc, date), $('<br>'))
  if (i == timeline.activeIndex) {
    item.attr({ class: 'active milestone' })
  }
})
