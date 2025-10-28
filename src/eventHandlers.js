import { todoController } from "./todo_fns";
import { loadItemData } from "./database_queries.js";
import { parseISO } from 'date-fns';

export const eventController = (() => {
    const dialogForm = document.querySelector(".todo-form");

    // Event for submitting new task form and updating database.
    const createTaskEvent = () => {
        const addTaskForm = document.querySelector(".add-todo-form");

        addTaskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const titleInput = document.getElementById("title-input").value.trim();
            const descInput = document.getElementById("description-input").value.trim();
            const dueDateInput = document.getElementById("date-input").value; // run date-fns here for formatting
            const importantInput = document.getElementById("tags-input");
            const tags = []; // handle checkboxes for important of not

            if (importantInput.checked) {
                tags.push(importantInput.value);
            }

            const dueDate = parseISO(dueDateInput); // converts to ISO date string

            const creationSuccess = todoController.createTodoItem(titleInput, descInput, dueDate, tags);

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

    // Event to open up add task form from sidebar button
    const newTaskShowEvent = () => {
        const newTaskBtn = document.getElementById("add-task");
        newTaskBtn.addEventListener("click", () => {
            dialogForm.showModal();
        })
    }

    // Event for clicking x to close form
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
