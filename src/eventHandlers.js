import { todoController } from "./todo_fns";
import { loadItemData } from "./database_queries.js";

export const eventController = (() => {
    const dialogForm = document.querySelector(".todo-form");


    const createTaskEvent = () => {
        const addTaskForm = document.querySelector(".add-todo-form");

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
        newTaskBtn.addEventListener("click", () => {
            dialogForm.showModal();
        })
    }

    const closeNewTaskForm = () => {
        const closeBtn = document.querySelector(".form-top > button");
        const addTaskForm = document.querySelector(".add-todo-form");

        closeBtn.addEventListener("click", () => {
            addTaskForm.reset();
            dialogForm.close();
        });
    }


    return {
        createTaskEvent,
        newTaskShowEvent,
        closeNewTaskForm,
    }
})();