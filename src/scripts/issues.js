const allowSaving = eval(sessionStorage.allowSaving)

let projectData = JSON.parse(sessionStorage.projectData)
let projectIssues = projectData.issues

const emptyDesc = 'empty description'

function saveSolution(issueID, solution) {
  // remove issue with given issueID from issues list in project json,
  // add issue data along with given solution to archive list in proj json,
  // also attach date to the object
  $('.issueDiv #data-' + issueID).parent().remove()
  var archivedIssue
  projectIssues.some((issue, i) => {
    if (issue.hashid == issueID) {
      archivedIssue = projectIssues.splice(i, 1)[0]
      return true
    }
  })
  archivedIssue.solution = solution
  var date = new Date()
  var dd = String(date.getDate())
  var mm = String(date.getMonth() + 1)
  var yyyy = date.getFullYear()
  archivedIssue.date = mm + '/' + dd + '/' + yyyy
  projectData.archive.push(archivedIssue)
  sessionStorage.projectData = JSON.stringify(projectData)
  allowSaving()
}

function addIssue(issue) {
  // label to click and expand/collapse issue data
  var label = $('<div>&#9658; ' + issue.title + '</div>').attr({
    class: 'issueLabel',
    id: 'label-' + issue.hashid
  }).on('click', () => {
    $('#data-' + issue.hashid).slideToggle()
    var lbl = $('#label-' + issue.hashid)
    var symbolCode = lbl.html().charCodeAt(0)
    if (symbolCode == 9658) { // == ►
      lbl.html('&#9660; ' + issue.title)
    } else {
      lbl.html('&#9658; ' + issue.title)
    }
  })
  var data = $('<div></div>').attr({
    class: 'issueData',
    id: 'data-' + issue.hashid
  })

  var descDiv = $('<div class="descDiv"></div>')
  var description = $('<p></p>')
  if (issue.desc != '') {
    description.text(issue.desc)
  } else {
    description.html('<i>' + emptyDesc + '</i>')
  }
  // editable description on click
  descDiv.on('click', () => {
    var issueDesc = $('#data-' + issue.hashid + ' .descDiv p')
    var oldDesc = issueDesc.text() != emptyDesc ? issueDesc.text() : ''
    var editBox = $('<textarea></textarea>').text(oldDesc)
    editBox.attr('class', 'editBox')
    editBox.on('keypress', (e) => {
      if (e.which == 13) {
        let newDesc = editBox.val()
        if (newDesc == '') {
          issueDesc.html('<i>' + emptyDesc + '</i>')
        } else {
          issueDesc.text(newDesc)
        }
        editBox.remove()
        issueDesc.parent().show()
        if (newDesc != oldDesc) {
          projectIssues.some((elem, i) => {
            if (elem.hashid == issue.hashid) {
              projectIssues[i].desc = newDesc
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

    issueDesc.parent().hide().after(editBox)
    editBox.trigger('focus')
  }) // end editable description func

  var selector = '#data-' + issue.hashid
  var solDiv = $('<div class="solDiv"></div>').append(
    $('<p>Solution:</p>').css('margin', 0),
    $('<textarea class="solTextArea"></textarea>'),
    $('<button class="archBtn">Archive solution</button>').on('click', () => {
      let solution = $(selector + ' .solDiv .solTextArea').val()
      if (solution != '') {
        saveSolution(issue.hashid, solution)
      }
    })
  )

  // delete button at end of issue data
  var delBtn = $('<button>delete</button>').on('click', () => {
    $('.issueDiv #data-' + issue.hashid).parent().remove()
    projectIssues.some((elem, i) => {
      if (elem.hashid == issue.hashid) {
        projectIssues.splice(i, 1)
        return true
      }
    })
    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  })

  // append appropriately
  descDiv.append(description)
  data.append(descDiv, solDiv, delBtn).hide()
  var issueDiv = $('<div class="issueDiv"></div>').append(label, data)
  $('#issueList').append(issueDiv)
}
// end addIssue()

if (projectIssues.length > 0) {
  $('#issueList').empty()
}

projectIssues.forEach((issue) => { addIssue(issue) })

// button to add a new issue
$('#addBtn').on('click', () => {
  var titleInput = $('#titleInput')
  if (titleInput.val() != '') {
    var issue = {
      hashid: new Date().getTime()
        ^ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      title: titleInput.val(),
      desc: '',
      completed: false
    }
    titleInput.val('')
    addIssue(issue)
    projectIssues.push(issue)
    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  }
})

$(() => {
  $('#issuesLink').addClass('activeLink')
})
