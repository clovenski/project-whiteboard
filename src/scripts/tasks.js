let projectTasks = JSON.parse(sessionStorage.projectData).tasks

projectTasks.forEach((task) => {
  var desc = $('<td></td>').html(task.desc)
  var status = $('<td></td>').html(task.completed ? 'complete' : 'in progress')
  $('#tasksTable').append($('<tr></tr>').append(desc, status))
})

$(() => {
  $('#tasksLink').addClass('activeLink')
})
