const allowSaving = eval(sessionStorage.allowSaving)

const remote = require('electron').remote
const dialog = remote.dialog

let projectData = JSON.parse(sessionStorage.projectData)
const resources = projectData.resources

const defTitle = 'New Resource'
const defDesc = 'empty description'

function editableText(e) {
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
        resources.some((elem, i) => {
          if (elem.hashid == id) {
            resources[i][key] = newVal
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
} // end editableText()

function addResource(res) {
  var container = $('<div></div>').attr({
    class: 'resDiv',
    id: 'res-' + res.hashid
  })
  var img = $('<img>').attr({ src: res.ref, class: 'resImg' })
  img.on('error', () => {
    let sub = $('<div>File not found. Click to add reference.</div>')
    sub.attr({ class: 'placeholder' })
    sub.on('click', () => {
      let result = dialog.showOpenDialog(remote.getCurrentWindow(), {
        title: 'Add reference',
        filters: [
          { name: 'Images', extensions: ['png', 'jpg', 'gif'] }
        ],
        properties: ['openFile']
      })
      if (result !== undefined) {
        container.children('.placeholder').remove()
        container.prepend($('<img>').attr({ src: result[0], class: 'resImg' }))
        resources.some((elem, i) => {
          if (elem.hashid == res.hashid) {
            resources[i].ref = result[0]
            return true
          }
        })
        sessionStorage.projectData = JSON.stringify(projectData)
        allowSaving()
      }
    }) // end substitute onclick func
    container.children('.resImg').remove()
    container.prepend(sub)
  }) // end error handling when broken ref

  var title = $('<h2 class="resTitle"></h2>')
  if (res.title !== '') {
    title.text(res.title)
  } else {
    title.html('<i>' + defTitle + '</i>')
  }
  title.on('click', {
      target: title,
      id: res.hashid,
      defVal: defTitle,
      key: 'title'
    }, editableText
  )
  var desc = $('<p class="resDesc"></p>')
  if (res.desc !== '') {
    desc.text(res.desc)
  } else {
    desc.html('<i>' + defDesc + '</i>')
  }
  desc.on('click', {
      target: desc,
      id: res.hashid,
      defVal: defDesc,
      key: 'desc'
    }, editableText
  )

  var delBtn = $('<button id="delBtn">delete</button>')
  delBtn.on('click', () => {
    container.remove()
    resources.some((elem, i) => {
      if (elem.hashid == res.hashid) {
        resources.splice(i, 1)
        return true
      }
    })
    // remove resource from info.body if exists
    projectData.info.body.forEach((elem, i) => {
      if (elem.type == 'img' && elem.value == res.ref) {
        projectData.info.body.splice(i, 1)
      }
    })

    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  })

  container.append(
    img, $('<div class="resInfo"></div>').append(title, desc),
    delBtn, $('<hr>')
  )
  $('#list').append(container)
} // end addResource()

resources.forEach((res) => { addResource(res) })

$('#addBtn').on('click', () => {
  var results = dialog.showOpenDialog(remote.getCurrentWindow(), {
    title: 'Add resources',
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'gif'] }
    ],
    properties: ['openFile', 'multiSelections']
  })

  if (results !== undefined) {
    results.forEach((path) => {
      let res = {
        hashid: new Date().getTime()
          ^ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        title: 'Untitled',
        desc: 'empty description',
        ref: path
      }
      addResource(res)
      resources.push(res)
    })
    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  }
}) // end add button on click func

$(() => {
  $('#resLink').addClass('activeLink')
})
