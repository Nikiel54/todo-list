import "./styles.css";
import { todoController } from "./todo_fns.js";
import { eventController } from "./eventHandlers.js";
import { uiController } from "./ui.js";

let userName = ""
if (localStorage.getItem("currentUser") === "null") {
    eventController.openLoginForm();
    eventController.handleLogins();
} else {
    userName = localStorage.getItem("currentUser");
}

todoController.init();
uiController.displayUser(userName);
uiController.displayTasks(-1, false); // display all by default
eventController.setEvents();