// grab the stuff from the html
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const error = document.querySelector("#form-error");
const list = document.querySelector("#task-list");

// load saved tasks from localstorage
// if there's nothing there (or it's broken) just start empty
let tasks = [];
try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch {
    tasks = [];
}

// save tasks to localstorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// draw tasks
function showTasks() {
    // clear the list first or everything shows up twice (ai?)
    list.replaceChildren();

    // loop through tasks and make a row for each one
    tasks.forEach(function (task, index) {
        
        // the row itself, done tasks get the "completed" class
        const row = document.createElement("li");
        row.className = task.completed ? "task completed" : "task";
        
        // remember which task to find it on click
        row.dataset.index = index;

        // button for marking item done
        const checkButton = document.createElement("button");
        checkButton.className = "check-button";
        checkButton.type = "button";

        // the task text (textContent so nobody can sneak html in) (ai?)
        const text = document.createElement("span");
        text.textContent = task.name;

        // button for deleting
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "x";

        // put it all together and stick it in the list
        row.append(checkButton, text, deleteButton);
        list.append(row);
    });
}

// when the form gets submitted: check the input and add the task
form.addEventListener("submit", function (event) {
    // stop the page from reloading
    event.preventDefault();

    // cut off extra spaces from the start and end
    const taskName = input.value.trim();

    // validation (over 3 characters items)
    if (taskName.length < 3) {
        
        // show the right error message
        error.textContent = taskName === ""
            ? "Please enter a task."
            : "Task must be at least 3 characters long.";
        
            // red border on the input
        input.classList.add("invalid");
        
        // stop here so the bad task doesn't get added
        return;
    }

    // input is fine, so clear the error and the red border
    error.textContent = "";
    input.classList.remove("invalid");
    // add the task, save it and redraw the list
    tasks.push({ name: taskName, completed: false });
    saveTasks();
    showTasks();
    // empty the input for the next one
    input.value = "";
});

// mark done or delete
// one listener on the whole list so it works for tasks added later too
list.addEventListener("click", function (event) {
    // find the task row that was clicked
    const row = event.target.closest(".task");
    // clicked somewhere else? do nothing
    if (!row) return;

    // get the position of the task in the array
    const index = Number(row.dataset.index);

    // check button: flip done / not done
    if (event.target.closest(".check-button")) {
        tasks[index].completed = !tasks[index].completed;
    }

    // delete button: remove the task
    if (event.target.closest(".delete-button")) {
        tasks.splice(index, 1);
    }

    // save the change and redraw
    saveTasks();
    showTasks();
});

// show the saved tasks when the page opens
showTasks();