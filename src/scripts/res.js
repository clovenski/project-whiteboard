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
  var img = $('<img>').attr({ src: res.ref })
  var title = $('<h2></h2>').text(res.title)
  var desc = $('<p></p>').text(res.desc)
  container.append(img, $('<div class="resInfo"></div>').append(title, desc))
  $('#list').append(container)
}

resources.forEach((res) => { addResource(res) })

var addBtn = $('<button>Add resources</button>').on('click', () => {
  var results = dialog.showOpenDialog(remote.getCurrentWindow(), {
    title: 'Add resources',
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'gif'] }
    ],
    properties: ['openFile', 'multiSelections']
  })

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
}) // end add button on click func
addBtn.attr('id', 'addBtn')

$('#content').append(addBtn)

$(() => {
  $('#resLink').addClass('activeLink')
})
