const allowSaving = eval(sessionStorage.allowSaving)

let projectData = JSON.parse(sessionStorage.projectData)
let projectTasks = projectData.tasks

function addTask(task) {
  // TODO: implement hashid for tasks when adding
  var row = $('<tr></tr>').attr({ id: 'row-' + task.hashid })
  var desc = $('<td class="task"></td>').html(task.desc)
  var status = $('<td></td>')
  var checkBox = $('<input></input>').attr({ type: 'checkbox' })
  if (task.completed) { checkBox.attr('checked', '') }
  status.append(checkBox)
  var delBtn = $('<button id="delBtn">delete</button>')
  row.append(desc, status, delBtn)
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
}

projectTasks.forEach((task) => { addTask(task) })

$('#content').append($('<button id="addTask">Add</button>').on('click', () => {
  var task = {
    hashid: new Date().getTime()
      ^ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    desc: 'empty task description',
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
