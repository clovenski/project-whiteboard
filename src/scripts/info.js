let projectInfo = JSON.parse(sessionStorage.projectData).info
const resDir = __dirname + '/../projects/' + projectInfo.name + '/res/'

$('#name').html(projectInfo.name)
if (projectInfo.description !== '') {
  $('#description').html(projectInfo.description)
}
projectInfo.body.forEach((element, i) => {
  var elemHtml
  switch (element.type) {
    case 'text':
      elemHtml = $('<p>' + element.value + '</p>')
      break
    case 'img':
      elemHtml = $('<img>').attr({ src: resDir + element.value })
      break
  }
  $('#infoBody').append(elemHtml.attr({ id: 'elem' + (i + 1) }), $('<br>'))
})
