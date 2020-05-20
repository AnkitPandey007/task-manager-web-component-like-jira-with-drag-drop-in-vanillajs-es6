/**
 * Fetching the task data
 */
fetch("tasks.json")
  .then((response) => response.json())
  .then((data) => {
    let taskManager = document.querySelectorAll("task-manager")[0];
    taskManager.setAttribute("data", JSON.stringify(data));
  });

/**
 * Fetching movies data
 */
fetch("movies.json")
  .then((response) => response.json())
  .then((data) => {
    let taskManager = document.querySelectorAll("task-manager")[1];
    taskManager.setAttribute("data", JSON.stringify(data));
  });
