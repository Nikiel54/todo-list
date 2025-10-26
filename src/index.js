import "./styles.css";
import { loadItemData } from "./database_queries.js";
import { todoController } from "./todo_fns.js";
import { eventController } from "./eventHandlers.js";

todoController.resetMemory()


eventController.newTaskShowEvent();
eventController.createTaskEvent()