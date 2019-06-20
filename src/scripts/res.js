const allowSaving = eval(sessionStorage.allowSaving)

const remote = require('electron').remote
const dialog = remote.dialog

let projectData = JSON.parse(sessionStorage.projectData)
const resources = projectData.resources

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

  var title = $('<h2 class="resTitle"></h2>').text(res.title)
  var desc = $('<p class="resDesc"></p>').text(res.desc)
  container.append(img, $('<div class="resInfo"></div>').append(title, desc))
  $('#list').append(container)
}

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
