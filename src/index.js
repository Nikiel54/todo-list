import "./styles.css";
import { todoController } from "./todo_fns.js";
import { eventController } from "./eventHandlers.js";
import { uiController } from "./ui.js";

let userName = "";

function startApp() {
    todoController.init();
    uiController.displayUser(userName);
    uiController.displayTasks(-1, false); // display all by default
    eventController.setEvents();
}

const storedUser = localStorage.getItem("currentUser");

if (!storedUser) {
    // Show login dialog, and only start after login completes
    eventController.openLoginForm();
    eventController.handleLogins((newUser) => {
    userName = newUser;
    localStorage.setItem("currentUser", userName);
    startApp(); // initialize everything after login
    });
} else {
    userName = storedUser;
    startApp(); // returning user → start immediately
}
