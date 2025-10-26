import { todoController } from "./todo_fns";
import { loadItemData } from "./database_queries.js";

export const eventController = (() => {
    const createTaskEvent = () => {
        const addTaskForm = document.querySelector(".add-todo-form");
        const dialogForm = document.querySelector(".todo-form");

        addTaskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const titleInput = document.getElementById("title-input").value;
            const descInput = document.getElementById("description-input").value;
            const dueDateInput = document.getElementById("date-input").value; // run date-fns here for formatting
            const tags = []; // handle checkboxes for important of not

            const creationSuccess = todoController.createTodoItem(titleInput, descInput, dueDateInput, tags);

            if (creationSuccess) {
                console.log("Task created successfully!");
            }

            addTaskForm.reset();
            dialogForm.close();

            let list = loadItemData();
            console.log("Stored tasks:");
            console.log(list);
        })
    }

    const newTaskShowEvent = () => {
        const newTaskBtn = document.getElementById("add-task");
        const dialogForm = document.querySelector(".todo-form");
        newTaskBtn.addEventListener("click", () => {
            dialogForm.showModal();
        })
    }

    /*
    // 🟩 Close dialog when clicking outside its boundaries
    dialog.addEventListener("click", (e) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

    if (clickedOutside) dialog.close();
    });
    */

    return {
        createTaskEvent,
        newTaskShowEvent,
    }
})();