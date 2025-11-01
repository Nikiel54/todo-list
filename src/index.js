import "./styles.css";
import { todoController } from "./todo_fns.js";
import { eventController } from "./eventHandlers.js";
import { uiController } from "./ui.js";

todoController.init();
uiController.displayAllTasks();
eventController.setEvents();