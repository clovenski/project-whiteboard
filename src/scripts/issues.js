let projectIssues = JSON.parse(sessionStorage.projectData).issues

function saveSolution(issueID, solution) {
  // remove issue with given issueID from issues list in project json,
  // add issue data along with given solution to archive list in proj json,
  // also attach date to data
}

projectIssues.forEach((issue) => {
  var label = $('<div>' + issue.title + '</div>').attr({
    class: 'issueLabel'
  }).on('click', () => {
    $('#data-' + issue.hashid).slideToggle()
  })
  var data = $('<div></div>').attr({
    class: 'issueData',
    id: 'data-' + issue.hashid
    // TODO: implement hashid for each issue when adding an issue
  })
  var description = $('<p></p>').html(
    issue.desc != '' ? issue.desc : '<i>empty description</i>'
  )
  var tabsBar = $('<div class="tabsBar"></div>')
  var selector = '#data-' + issue.hashid
  tabsBar.append(
    $('<button class="notesBtn activeBtn">Notes</button>').on('click', () => {
      $(selector + ' .tabDisplay .activeTab').hide().removeClass('activeTab')
      $(selector + ' .tabDisplay .notesTab').show().addClass('activeTab')
      $(selector + ' .tabsBar .activeBtn').removeClass('activeBtn')
      $(selector + ' .tabsBar .notesBtn').addClass('activeBtn')
    }),
    $('<button class="solBtn">Solution</button>').on('click', () => {
      $(selector + ' .tabDisplay .activeTab').hide().removeClass('activeTab')
      $(selector + ' .tabDisplay .solTab').show().addClass('activeTab')
      $(selector + ' .tabsBar .activeBtn').removeClass('activeBtn')
      $(selector + ' .tabsBar .solBtn').addClass('activeBtn')
    })
  )
  var tabDisplay = $('<div class="tabDisplay"></div>')
  var notesTab = $('<div></div>').attr({
    class: 'notesTab activeTab'
  }).html($('<textarea></textarea>').text(issue.notes))
  var solTab = $('<div class="solTab"></div>').append(
    $('<textarea class="solTxtArea"></textarea>'),
    $('<button>Save/Archive</button>').on('click', () => {
      var solution = $(selector + ' .tabDisplay .solTab textarea').val()
      saveSolution(issue.hashid, solution)
    })
  ).hide()
  tabDisplay.append(notesTab, solTab)
  data.append(description, tabsBar, tabDisplay).hide()
  $('#content').append($('<div class="issueDiv"></div>').append(label, data))
})

$(() => {
  $('#issuesLink').addClass('activeLink')
})
