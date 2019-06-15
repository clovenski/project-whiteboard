const fs = require('fs')

let projectData = JSON.parse(sessionStorage.projectData)
const resDir = __dirname + '/../projects/' + projectData.info.name + '/res/'

if (fs.readdirSync(resDir).length > 0 && projectData.resources.length > 0) {
  // remove empty list text and append all the resources
  $('#list').empty()
  projectData.resources.forEach((res) => {
    var container = $('<div></div>').attr({
      class: 'res',
      id: res.title
    })
    var img = $('<img>').attr({ src: resDir + res.ref })
    var title = $('<h2></h2>').html(res.title)
    var desc = $('<p></p>').html(res.desc)
    container.append(img, $('<div></div>').append(title, desc))
    $('#list').append(container)
  })
}
