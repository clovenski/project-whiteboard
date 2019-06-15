let projectData = JSON.parse(sessionStorage.projectData)
const resDir = __dirname + '/../projects/' + projectData.info.name + '/res/'

$('#name').html(projectData.info.name)
if (projectData.info.description !== '') {
  $('#description').html(projectData.info.description)
}
projectData.info.body.forEach((element, i) => {
  var elemHtml
  switch (element.type) {
    case 'text':
      elemHtml = $('<p>' + element.value + '</p>')
      break;
    case 'img':
      elemHtml = $('<img>').attr({ src: resDir + element.value })
      break;
  }
  $('#infoBody').append(elemHtml.attr({ id: 'elem' + (i + 1) }))
})
