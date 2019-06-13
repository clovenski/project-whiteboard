let projectData = JSON.parse(sessionStorage.projectData)

$('#name').html(projectData.name)
if (projectData.description) {
  $('#description').html(projectData.description)
}
