let projectTasks = JSON.parse(sessionStorage.projectData).tasks
const saveFilePath = sessionStorage.saveFilePath

projectTasks.forEach((task) => {
  var desc = $('<td class="task"></td>').html(task.desc)
  var status = $('<td></td>').html(task.completed ? 'complete' : 'in progress')
    .attr('class', 'status')
  $('#tasksTable').append($('<tr></tr>').append(desc, status))
})

$(() => {
  $('#tasksLink').addClass('activeLink')
})
