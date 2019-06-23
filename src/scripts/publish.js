// const projectData is defined: object containing all project data
const fs = require('fs')
const tmp = require('tmp')
const archiver = require('archiver')
const path = require('path')
window.$ = window.jQuery = require('jquery')


// append info to header: path to publishes directory
$('#header').append('The zip file will be located in '
  + path.resolve(__dirname, '../publishes/')
).css({
  position: 'sticky',
  top: 0
})

$('title').text(projectData.info.name)

// fill project info content
let infoSelector = '#info-content'
$(infoSelector + ' #name').text(projectData.info.name)
if (projectData.info.author !== '') {
  $(infoSelector + ' #author').text(projectData.info.author)
  $(infoSelector + ' #author').prepend('Author: ')
} else {
  $(infoSelector + ' #author').remove()
}
if (projectData.info.description !== '') {
  $(infoSelector + ' #description').text(projectData.info.description)
  $(infoSelector + ' #description').prepend('Description: ')
} else {
  $(infoSelector + ' #description').remove()
}
if (projectData.info.body.length == 0) {
  $(infoSelector + ' #infoBody').remove()
} else {
  projectData.info.body.forEach((element) => {
    var elemDiv = $('<div class="elemDiv"></div>')
    var elemHtml
    switch (element.type) {
      case 'text':
        elemHtml = $('<p>' + element.value + '</p>')
        break
      case 'img':
        elemHtml = $('<img>').attr({ src: element.value })
        elemHtml.css({
          'min-width': '150px',
          'min-height': '150px',
          'max-width': '300px',
          'max-height': '300px',
          margin: '10px',
          'pointer-events': 'none'
        })
        elemHtml.on('error', () => { elemDiv.remove() })
        break
    }
    elemDiv.append(elemHtml)
    $(infoSelector + ' #infoBody').append(elemDiv)
  })
}

// fill project resources content
if (projectData.resources.length == 0) {
  $('#res-content').remove()
} else {
  projectData.resources.forEach((res) => {
    var container = $('<div></div>').attr({
      class: 'resDiv'
    })
    container.css('display', 'inline-flex')
    var img = $('<img>').attr({ src: res.ref, class: 'resImg' })
    img.css({
      'min-width': '150px',
      'min-height': '150px',
      'max-width': '300px',
      'max-height': '300px',
      margin: '10px',
      'pointer-events': 'none'
    })
    img.on('error', () => { container.remove() })
    var title = $('<h2 class="resTitle"></h2>')
    if (res.title !== '') {
      title.text(res.title)
    } else {
      title.html('<i>Untitled</i>')
    }
    var desc = $('<p class="resDesc"></p>')
    if (res.desc !== '') {
      desc.text(res.desc)
    } else {
      desc.html('<i>empty description</i>')
    }
    container.append(
      img, $('<div class="resInfo"></div>').append(title, desc)
    )
    $('#res-content #list').append(container)
  })
}

// fill project timeline content
if (projectData.timeline.data.length == 0) {
  $('#timeline-content').remove()
} else {
  var addedActive = false
  projectData.timeline.data.forEach((milestone, i) => {
    var indexElem = $('<li></li>').attr({
      class: 'milestone'
    }).text(i + 1).css({
      width: '2em',
      height: '2em',
      'text-align': 'center',
      'line-height': '2em',
      'border-radius': '1em',
      background: 'rgb(35, 53, 73)',
      margin: '0 1em',
      display: 'inline-grid',
      color: 'white',
      position: 'relative'
    })
    if (!addedActive) {
      addedActive = milestone.hashid == projectData.timeline.activeID
    } else {
      indexElem.css('background', 'lightgrey')
    }
    var desc = $('<h3 class="msDesc"></h3>')
    if (milestone.desc !== '') {
      desc.text(milestone.desc.substring(0, 40))
    } else {
      desc.html('<i>Untitled Milestone</i>')
    }
    var date = $('<span class="msDate"></span>')
    if (milestone.date == undefined || milestone.date == '') {
      date.html('<i>TBD</i>')
    } else {
      date.text(milestone.date)
    }
    var container = $('<div></div>').attr({
      class: 'milestoneDiv'
    })
    container.append(
      indexElem,
      $('<div class="milestoneInfo"></div>').append(desc, date)
        .css('display', 'inline-grid'),
      $('<br>')
    )
    $('#timeline').append(container)
  })
}

// fill project tasks content
if (projectData.tasks.length == 0) {
  $('#tasks-content').remove()
} else {
  projectData.tasks.forEach((task) => {
    var borderStyle = {
      border: '1px solid black',
      'border-collapse': 'collapse'
    }
    var row = $('<tr></tr>').css(borderStyle)
    var desc = $('<td></td>').css(borderStyle)
      .css('padding', '10px')
    var descDiv = $('<div class="task"></div>')
    var descSpan = $('<span class="taskDesc"></span>')
    if (task.desc !== '') {
      descSpan.text(task.desc)
    } else {
      descSpan.html('<i>empty description</i>')
    }
    desc.append(descDiv.append(descSpan))
    var status = $('<td class="status"></td>').css(borderStyle)
      .css('padding', '10px')
    var checkBox = $('<input></input>').attr({ type: 'checkbox' })
    checkBox.css('pointer-events', 'none')
    if (task.completed) { checkBox.attr('checked', '') }
    status.append(checkBox)
    row.append(desc, status)
    $('#tasks-content #tasksTable').append(row)
  })
}

// fill project issues content
if (projectData.issues.length == 0) {
  $('#issues-content').remove()
} else {
  projectData.issues.forEach((issue) => {
    // label to click and expand/collapse issue data
    var label = $('<div>&#9660; ' + issue.title + '</div>').attr({
      class: 'issueLabel'
    })
    var data = $('<div></div>').attr({ class: 'issueData' })
    var description = $('<p></p>')
    if (issue.desc != '') {
      description.text(issue.desc)
    } else {
      description.html('<i>empty description</i>')
    }

    data.append(description)
    var issueDiv = $('<div class="issueDiv"></div>').append(label, data)
    $('#issues-content #issueList').append(issueDiv)
  })
}

// fill project archive content
if (projectData.archive.length == 0) {
  $('#archive-content').remove()
} else {
  projectData.archive.forEach((issue, i) => {
    var container = $('<div></div>').attr({
      class: 'issueDiv'
    }).append(
      $('<p></p>').text(issue.title).prepend('<b>Title:</b> '),
      $('<p></p>').text(issue.desc).prepend('<b>Description:</b> '),
      $('<p></p>').text(issue.solution).prepend('<b>Solution:</b> '),
      $('<p></p>').text(issue.date).prepend('<b>Date:</b> ')
    )
    if (i != projectData.archive.length - 1) {
      container.append('<hr width="100px">')
    }
    $('#archive-content #archive').append(container)
  })
}


// publish button on click func
$('#publishBtn').on('click', () => {
  $('#header, #control').remove()

  // change src ref for all images to res/ dir
  // and copy all to tmp dir to be zipped with html
  let tmpDir = tmp.dirSync({ mode: '0755', unsafeCleanup: true })
  let resDir = path.join(tmpDir.name, 'res/')
  fs.mkdirSync(resDir)
  $.each($('img'), (_, val) => {
    val = $(val)
    let oldPath = val.attr('src')
    let basename = path.basename(oldPath)
    let newPath = path.join('./res/', basename)
    val.attr('src', newPath)

    fs.copyFileSync(oldPath, path.join(resDir, basename))
  })

  // generate README file in tmp dir
  let readmeData = `Project name: ${projectData.info.name}\n`
  if (projectData.info.author !== '') {
    readmeData += `Author: ${projectData.info.author}\n`
  }
  readmeData += `Published on: ${new Date().toDateString()}\n`
  readmeData += '\nThe project can be viewed with index.html.\n'
  readmeData += '\nGenerated using Project Whiteboard.\n'
  readmeData += 'Check it out at '
    + 'https://github.com/clovenski/project-whiteboard' + '\n'
  fs.writeFileSync(path.join(tmpDir.name, 'README.txt'), readmeData)

  // saving page state
  let publishedHTML = `<!DOCTYPE html><html>${$('html').html()}</html>`
  fs.writeFileSync(path.join(tmpDir.name, 'index.html'), publishedHTML)

  // clear html body, show progress
  $('body').empty().append(
    $('<p style="font-size:1.5em">Generating the zip file. . . </p>')
  )

  // zip the directory
  let zipFilePath = path.resolve(
    `${__dirname}/../publishes/${projectData.info.name}.zip`
  )
  if (!fs.existsSync(zipFilePath)) {
    // create publishes dir if not exists
    if (!fs.existsSync(path.resolve(`${__dirname}/../publishes/`))) {
      fs.mkdirSync(path.resolve(`${__dirname}/../publishes/`))
    }
    // create zip file
    fs.closeSync(fs.openSync(zipFilePath, 'w'))
  }

  let output = fs.createWriteStream(zipFilePath)
  output.on('finish', () => {
    // show 'DONE' for confirmation of zip file generated
    $('body p').append($('<span style="color:green">DONE</span>'))
    $('body').append($(`<p>File path: ${zipFilePath}</p>`))
    $('body').append($('<p>You can now close this window.</p>'))
    tmpDir.removeCallback()
  })
  let archive = archiver('zip', { zlib: { level: 9 } })
  archive.on('error', (e) => { throw e })
  archive.pipe(output)
  archive.directory(tmpDir.name, projectData.info.name)
  archive.finalize()
})

