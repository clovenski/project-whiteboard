const allowSaving = eval(sessionStorage.allowSaving)

let projectData = JSON.parse(sessionStorage.projectData)
const timeline = projectData.timeline
const saveFilePath = sessionStorage.saveFilePath

const defaultTitle = 'New Milestone'
const defaultDate = 'TBD'

function editableText(e) {
  let target = e.data.target
  let id = e.data.id
  let maxChars = e.data.maxChars
  let defaultVal = e.data.defVal
  let editingDesc = e.data.editingDesc
  let editBox = $('<textarea></textarea>').text(
    target.text() != defaultVal ? target.text() : ''
  )
  editBox.attr({
    class: 'editBox',
    maxlength: maxChars
  })
  editBox.on('keypress', (e) => {
    if (e.which == 13) {
      let newVal = editBox.val()
      if (newVal == '') {
        target.html('<i>' + defaultVal + '</i>')
      } else {
        target.text(newVal)
      }
      editBox.remove()
      target.show()
      timeline.data.some((elem, i) => {
        if (elem.hashid == id) {
          if (editingDesc) {
            timeline.data[i].desc = newVal
          } else {
            timeline.data[i].date = newVal
          }
          return true
        }
      })
      sessionStorage.projectData = JSON.stringify(projectData)
      allowSaving()
    }
  }) // end editBox on keypress
  target.hide().after(editBox)
  editBox.trigger('focus')
} // end editableText()

function addMilestone(milestone, i, asActive) {
  var indexElem = $('<li></li>').attr({
    class: 'milestone',
    id: 'ms-' + milestone.hashid
  }).text(i + 1)
  var desc = $('<h3 class="msDesc"></h3>')
  if (milestone.desc != '' && milestone.desc != defaultTitle) {
    desc.text(milestone.desc.substring(0, 40))
  } else {
    desc.html('<i>' + defaultTitle + '</i>')
  }
  desc.on('click',
    {
      target: desc,
      id: milestone.hashid,
      maxChars: 40,
      defVal: defaultTitle,
      editingDesc: true
    }, editableText
  )
  var date = $('<span class="msDate"></span>')
  if (milestone.date == undefined || milestone.date == '') {
    date.html('<i>TBD</i>')
  } else {
    date.text(milestone.date)
  }
  date.on('click',
    {
      target: date,
      id: milestone.hashid,
      maxChars: 10,
      defVal: defaultDate,
      editingDesc: false
    }, editableText
  )

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
    indexElem,
    $('<div class="milestoneInfo"></div>').append(desc, date),
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
$('#addBtn').on('click', () => {
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
})

$(() => {
  $('#timelineLink').addClass('activeLink')
})
