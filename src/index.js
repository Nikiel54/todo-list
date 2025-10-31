import "./styles.css";
import { todoController } from "./todo_fns.js";
import { eventController } from "./eventHandlers.js";

todoController.resetMemory()
eventController.setEvents();