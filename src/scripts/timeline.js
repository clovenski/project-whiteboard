const allowSaving = eval(sessionStorage.allowSaving)

let projectData = JSON.parse(sessionStorage.projectData)
const timeline = projectData.timeline
const saveFilePath = sessionStorage.saveFilePath

const defaultTitle = 'New Milestone'

function addMilestone(milestone, i, asActive) {
  var item = $('<li></li>').attr({
    class: 'milestone',
    id: 'ms-' + milestone.hashid
  }).text(i + 1)
  var desc = $('<h3></h3>')
  desc.text(milestone.desc != '' ? milestone.desc : defaultTitle)
  var date = $('<span></span>')
  if (milestone.date !== undefined) {
    date.text(milestone.date)
  } else {
    date.html('<i>TBD</i>')
  }
  var activeCheckBox = $('<input type="checkbox">').on('click', () => {
    $('.activeCheckBox').removeClass('activeCheckBox').prop('checked', false)
    activeCheckBox.addClass('activeCheckBox').prop('checked', true)
    $('.active').removeClass('active')
    $('#msDiv-' + milestone.hashid).addClass('active')
    timeline.activeID = milestone.hashid
    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  })
  var delBtn = $('<button>delete</button>').on('click', () => {
    if (container.hasClass('active')) {
      let target = container.prev().length == 1 ?
        container.prev() : container.next()
      target.addClass('active')
      target.children('input').addClass('activeCheckBox')
        .prop('checked', true)
    }
    let index = Number.parseInt(container.children('.milestone').text())
    container.nextAll().each((i, nextContainer) => {
      nextContainer = $(nextContainer)
      nextContainer.children('.milestone').text(index + i)
    })
    container.remove()
    timeline.data.some((elem, i) => {
      if (elem.hashid == milestone.hashid) {
        timeline.data.splice(i, 1)
        return true
      }
    })
    if ($('#timeline').children().length == 0) { timeline.activeID = null }
    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  }) // end delBtn onclick func
  var container = $('<div></div>').attr({
    class: 'milestoneDiv',
    id: 'msDiv-' + milestone.hashid
  })
  container.append(
    item,
    $('<div></div>').append(desc, date),
    activeCheckBox,
    delBtn,
    $('<br>')
  )
  $('#timeline').append(container)

  if (asActive) {
    container.addClass('active')
    activeCheckBox.addClass('activeCheckBox').prop('checked', true)
  }
} // end addMilestone()

timeline.data.forEach((milestone, i) => {
  addMilestone(milestone, i, milestone.hashid == timeline.activeID)
})

// add new milestone button
$('#content').append($('<button id="addBtn">+</button>').on('click', () => {
  let nextIndex = $('#timeline').children().length
  let asActive = nextIndex == 0
  let milestone = {
    hashid: new Date().getTime()
      ^ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    desc: defaultTitle
  }
  addMilestone(milestone, nextIndex, asActive)
  timeline.data.push(milestone)
  if (asActive) { timeline.activeID = milestone.hashid }
  sessionStorage.projectData = JSON.stringify(projectData)
  allowSaving()
}))

$(() => {
  $('#timelineLink').addClass('activeLink')
})
