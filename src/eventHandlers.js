import { todoController } from "./todo_fns";
import { loadItemData } from "./database_queries.js";
import { parseISO } from 'date-fns';

export const eventController = (() => {
    const dialogForm = document.querySelector(".todo-form");
    const FAR_FUTURE = new Date(8640000000000000);

    const setEvents = () => {
        createTaskEvent();
        newTaskShowEvent();
        closeNewTaskForm();
        sidebarClickEvents();
    }

    function turnOffAddBtn(newTaskBtn) {
        const svgChild = newTaskBtn.querySelector("svg");
        const oldClr = "#FAF3E0";
        const notClicked = "unfocused";

        newTaskBtn.dataset.id = notClicked;
        newTaskBtn.style.color = oldClr;
        svgChild.style.fill = oldClr;
    }



    // Event for submitting new task form and updating database.
    const createTaskEvent = () => {
        const newTaskBtn = document.getElementById("add-task");
        const addTaskForm = document.querySelector(".add-todo-form");

        addTaskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const titleInput = document.getElementById("title-input").value.trim();
            const descInput = document.getElementById("description-input").value.trim();
            const dueDateInput = document.getElementById("date-input").value;
            const importantInput = document.getElementById("tags-input");
            const tags = []; 

            // Handles missing date inputs.
            let dueDate;
            if (dueDateInput === "") {
                dueDate = FAR_FUTURE; // No date given is considered a long term task instead
            } else {
                dueDate = parseISO(dueDateInput); // converts to ISO date string
            }

            // handle checkboxes for important or not
            if (importantInput.checked) {
                tags.push(importantInput.value);
            }

            const creationSuccess = todoController.createTodoItem(titleInput, descInput, dueDate, tags);

            if (creationSuccess) {
                console.log("Task created successfully!");
            }

            addTaskForm.reset();
            dialogForm.close();

            //insert function to turn off btn styling
            turnOffAddBtn(newTaskBtn);

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
        const newTaskBtn = document.getElementById("add-task");
        const closeBtn = document.querySelector(".form-top > button");
        const addTaskForm = document.querySelector(".add-todo-form");

        closeBtn.addEventListener("click", () => {
            addTaskForm.reset();
            dialogForm.close();
            turnOffAddBtn(newTaskBtn);
        });
    }

    
    const sidebarClickEvents = () => {
        const sidebarBtns = document.querySelectorAll(".sidebar-row > button");
        const isClicked = "displaying";
        const notClicked = "unfocused";

        sidebarBtns.forEach((Btn) => {
            const newClr = "#F2C57C";
            const oldClr = "#FAF3E0";
            Btn.addEventListener("click", (e) => {
                const svgChild = e.currentTarget.querySelector("svg");

                const currState = e.currentTarget.dataset.id;
                if (currState === isClicked) {
                    e.currentTarget.style.color = oldClr;
                    svgChild.style.fill = oldClr;
                    e.currentTarget.dataset.id = notClicked; // turn state off
                } else {
                    e.currentTarget.style.color = newClr;
                    svgChild.style.fill = newClr;
                    e.currentTarget.dataset.id = isClicked; // turn state on
                }
            })
        });
    }

    return {
        setEvents,
    }
})();

