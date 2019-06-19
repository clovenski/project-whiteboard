const allowSaving = eval(sessionStorage.allowSaving)

let projectData = JSON.parse(sessionStorage.projectData)
let projectTasks = projectData.tasks

// string to use for tasks with no description defined by user
const emptyDesc = 'empty task description'

// add the given task to the table
function addTask(task) {
  var row = $('<tr></tr>').attr({ id: 'row-' + task.hashid })
  var desc = $('<td></td>')
  var descDiv = $('<div class="task"></div>')
  var descSpan = $('<span class="taskDesc"></span>')
  if (task.desc != '') {
    descSpan.text(task.desc)
  } else {
    descSpan.html('<i>' + emptyDesc + '</i>')
  }
  desc.append(descDiv.append(descSpan))
  var status = $('<td class="status"></td>')
  var checkBox = $('<input></input>').attr({ type: 'checkbox' })
  if (task.completed) { checkBox.attr('checked', '') }
  status.append(checkBox)
  var options = $('<td class="options"></td>')
  var delBtn = $('<button class="delBtn">delete</button>')
  options.append(delBtn)
  row.append(desc, status, options)
  $('#tasksTable').append(row)

  // on click, update projectData and sessionStorage.projectData
  checkBox.on('click', () => {
    projectTasks.some((elem, i) => {
      if (elem.hashid == task.hashid) {
        let val = projectTasks[i].completed
        projectTasks[i].completed = !val
        return true
      }
    })
    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  })

  // on click, delete row and update projectData, local and sessionStorage
  delBtn.on('click', () => {
    $('#row-' + task.hashid).remove()
    projectTasks.some((elem, i) => {
      if (elem.hashid == task.hashid) {
        projectTasks.splice(i, 1)
        return true
      }
    })
    sessionStorage.projectData = JSON.stringify(projectData)
    allowSaving()
  })

  // on click, allow edit task description
  desc.children('.task').on('click', () => {
    var taskDesc = $('#row-' + task.hashid + ' .task .taskDesc')
    var editBox = $('<textarea></textarea>').text(
      taskDesc.text() != emptyDesc ? taskDesc.text() : ''
    )
    editBox.attr('class', 'editBox')
    editBox.on('keypress', (e) => {
      if (e.which == 13) {
        let newDesc = editBox.val()
        if (newDesc == '') {
          taskDesc.html('<i>' + emptyDesc + '</i>')
        } else {
          taskDesc.text(newDesc)
        }
        editBox.remove()
        taskDesc.parent().show()
        projectTasks.some((elem, i) => {
          if (elem.hashid == task.hashid) {
            projectTasks[i].desc = newDesc
            return true
          }
        })
        sessionStorage.projectData = JSON.stringify(projectData)
        allowSaving()
      }
    }) // end editBox on keypress
    taskDesc.parent().hide().after(editBox)
    editBox.trigger('focus')
  }) // end desc on click
} // end addTask()

projectTasks.forEach((task) => { addTask(task) })

// button to add a new task to the table
$('#content').append($('<button id="addBtn">+</button>').on('click', () => {
  var task = {
    hashid: new Date().getTime()
      ^ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    desc: emptyDesc,
    completed: false
  }
  addTask(task)
  projectTasks.push(task)
  sessionStorage.projectData = JSON.stringify(projectData)
  allowSaving()
}))

$(() => {
  $('#tasksLink').addClass('activeLink')
})
