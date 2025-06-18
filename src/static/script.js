window.addEventListener('DOMContentLoaded', loadsTasks);

// Function to fetch and display tasks from the server
async function loadsTasks() {
  const response = await fetch('/todos');
  const todos = await response.json();

  openList.innerHTML = "";
  completedList.innerHTML = "";

  // Get the lists for open and completed tasks
  todos.forEach(todo => {
    const li = document.createElement("li");
    li.textContent = todo.text;
    li.dataset.id = todo.id;
    if (todo.completed) {
      li.classList.add('checked');
      completedList.appendChild(li);
    } else {
      openList.appendChild(li);
    }

    // Create a "close" button for each task
    const span = document.createElement("SPAN");
    span.className = "close";
    span.textContent = "\u00D7";
    span.onclick = () => deleteTask(todo.id);
    li.appendChild(span);
  });
}
/*
// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
// Get the lists for open and completed tasks
function handleListClick(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');

    if (ev.target.classList.contains('checked')) {
      completedList.appendChild(ev.target);
    } else {
      openList.appendChild(ev.target);
    }
  }
}
*/
var openList = document.getElementById("openTasks");
var completedList = document.getElementById("completedTasks");

openList.addEventListener('click', handleListClick, false);
completedList.addEventListener('click', handleListClick, false);

function handleListClick(ev) {
  if (ev.target.tagName === 'LI') {
    const li = ev.target;
    const id = li.dataset.id;
    const isCompleted = !li.classList.contains('checked');
    
    fetch(`/todos/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ completed: isCompleted })
    }).then(() => loadsTasks()); // Reload tasks after toggling
  }
}

async function deleteTask(id) {
  await fetch(`/todos/${id}`, {method: 'DELETE'});
  loadsTasks(); // Reload tasks after deletion
}

// Create a new list item by clicking the "Enter" button
var enter = document.getElementById("myInput");
enter.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    newElement();
  }
});

/*
// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("openTasks").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  var close = document.getElementsByClassName("close");
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}
  */
 async function newElement() {
  const input = document.getElementById("myInput");
  const text = input.value.trim();
  if (!text) {
    alert("You must write something!");
    return;
  }

  await fetch('/todos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  input.value = ""; // Clear the input field
  loadsTasks(); // Reload the tasks
  }