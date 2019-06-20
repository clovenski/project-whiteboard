const allowSaving = eval(sessionStorage.allowSaving)

let projectData = JSON.parse(sessionStorage.projectData)
let projectInfo = projectData.info
let resources = projectData.resources
const resDir = sessionStorage.projDir + 'res/'

$('#name').text(projectInfo.name)
$('#author').text(projectInfo.author)
if (projectInfo.description !== '') {
  $('#description').text(projectInfo.description)
}

function addToBody(element) {
  var elemHtml
  switch (element.type) {
    case 'text':
      elemHtml = $('<p>' + element.value + '</p>')
      break
    case 'img':
      elemHtml = $('<img>').attr({ src: element.value })
      break
  }
  $('#infoBody').append(elemHtml.attr('id', 'elem-' + element.hashid))
}

projectInfo.body.forEach((element) => { addToBody(element) })

// input text area on enter keypress func
$('#inputText').on('keypress', (e) => {
  let text = $('#inputText').val()
  if (e.which == 13 && text !== '') {
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
