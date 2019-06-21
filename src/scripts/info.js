const allowSaving = eval(sessionStorage.allowSaving)

let projectData = JSON.parse(sessionStorage.projectData)
let projectInfo = projectData.info
let resources = projectData.resources
const resDir = sessionStorage.projDir + 'res/'

const defAuthor = 'no author'
const defDesc = 'empty description'
const defText = 'empty text'

let author = $('#author')
let description = $('#description')

$('#name').text(projectInfo.name)
if (projectInfo.author != '') {
  author.text(projectInfo.author)
} else {
  author.html('<i>' + defAuthor + '</i>')
}
if (projectInfo.description !== '') {
  description.text(projectInfo.description)
} else {
  description.html('<i>' + defDesc + '</i>')
}

function editableProjInfo(e) {
  let target = e.data.target
  let defaultVal = e.data.defVal
  let key = e.data.key
  let oldVal = target.text() != defaultVal ? target.text() : ''
  let editBox = $('<textarea></textarea>').text(oldVal)
  editBox.attr({ class: 'editBox' })
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
      if (newVal != oldVal) {
        projectInfo[key] = newVal
        sessionStorage.projectData = JSON.stringify(projectData)
        allowSaving()
      }
    }
  }) // end editBox on keypress
  // trigger enter keypress when editBox loses focus
  editBox.on('focusout', () => {
    let event = $.Event('keypress', { which: 13 })
    editBox.trigger(event)
  })

  target.hide().after(editBox)
  editBox.trigger('focus')
}
// end editableProjInfo()
// use above func for appropriate text elements
author.on('click', {
    target: author,
    defVal: defAuthor,
    key: 'author'
  }, editableProjInfo
)
author.addClass('editable')
description.on('click', {
  target: description,
  defVal: defDesc,
  key: 'description'
}, editableProjInfo
)
description.addClass('editable')

function editableBodyText(e) {
  let target = e.data.target
  let id = e.data.id
  let defaultVal = e.data.defVal
  let key = e.data.key
  let oldVal = target.text() != defaultVal ? target.text() : ''
  let editBox = $('<textarea></textarea>').text(oldVal)
  editBox.attr({ class: 'editBox' })
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
      if (newVal != oldVal) {
        projectInfo.body.some((elem, i) => {
          if (elem.hashid == id) {
            projectInfo.body[i][key] = newVal
            return true
          }
        })
        sessionStorage.projectData = JSON.stringify(projectData)
        allowSaving()
      }
    }
  }) // end editBox on keypress
  // trigger enter keypress when editBox loses focus
  editBox.on('focusout', () => {
    let event = $.Event('keypress', { which: 13 })
    editBox.trigger(event)
  })

  target.hide().after(editBox)
  editBox.trigger('focus')
} // end editableBodyText()

function deleteElement(e) {
  let target = e.data.target
  let id = e.data.id
  target.remove()
  projectInfo.body.some((elem, i) => {
    if (elem.hashid == id) {
      projectInfo.body.splice(i, 1)
      return true
    }
  })
  sessionStorage.projectData = JSON.stringify(projectData)
  allowSaving()
}

function addToBody(element) {
  var elemDiv = $('<div class="elemDiv"></div>')
  var elemHtml
  switch (element.type) {
    case 'text':
      elemHtml = $('<p>' + element.value + '</p>')
      elemHtml.on('click', {
          target: elemHtml,
          id: element.hashid,
          defVal: defText,
          key: 'value'
        }, editableBodyText
      )
      elemHtml.addClass('editable')
      break
    case 'img':
      elemHtml = $('<img>').attr({ src: element.value })
      elemHtml.on('error', () => { elemDiv.remove() })
      break
  }
  var delBtn = $('<button class="delBtn">delete</button>').on('click', {
      target: elemDiv,
      id: element.hashid
    }, deleteElement
  )
  elemDiv.append(elemHtml, delBtn)
  $('#infoBody').append(elemDiv)
}

projectInfo.body.forEach((element) => { addToBody(element) })

// input text area on enter keypress func
$('#inputText').on('keypress', (e) => {
  if (e.which == 13) {
    e.preventDefault()
    let text = $('#inputText').val()
    if (text != '') {
      let element = {
        hashid: new Date().getTime()
          ^ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        type: 'text',
        value: text
      }
      addToBody(element)
      projectInfo.body.push(element)
      sessionStorage.projectData = JSON.stringify(projectData)
      allowSaving()
    }
    $('#inputText').val('')
  }
})

function addToResPanel(res) {
  var img = $('<img>').attr({ src: res.ref })
  img.on('click', () => {
    let element = {
      hashid: new Date().getTime()
        ^ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      type: 'img',
      value: res.ref
    }
    addToBody(element)
    projectInfo.body.push(element)
    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  })
  img.on('error', () => { img.remove() })
  $('#resPanel').append(img)
}

resources.forEach((res) => { addToResPanel(res) })

$(() => {
  $('#infoLink').addClass('activeLink')
})
