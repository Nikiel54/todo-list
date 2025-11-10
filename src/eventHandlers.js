import { todoController } from "./todo_fns";
import { loadItemData, setUserName } from "./database_queries.js";
import { format, parseISO, isValid } from 'date-fns';
import { uiController } from "./ui.js";

export const FAR_FUTURE = "9999-12-31T23:59:59.999Z";

export const eventController = (() => {
    const dialogForm = document.querySelector(".todo-form");
    const upcomingSection = document.querySelector('button[data-section="Upcoming"]');
    let lastClickedSection = upcomingSection;
    const activeColor = "#F2C57C";
    const inactiveColor = "#FAF3E0";

    const setEvents = () => {
        createTaskEvent();
        newTaskShowEvent();
        closeNewTaskForm();
        initSidebarSections();
        sidebarClickEvents();
        actionBtnEvents();
    }


    // Means to set the upcoming section to active by default.
    const initSidebarSections = () => {
        let lastClickedSvg = lastClickedSection.querySelector("svg");
        lastClickedSection.style.color = activeColor;
        lastClickedSvg.style.fill = activeColor;
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

            // Determines if to make a new task or update an old one
            let creationSuccess;
            if (addTaskForm.dataset.mode === "Create") {
                creationSuccess = todoController.createTodoItem(titleInput, descInput, dueDate, tags);
            }
            else if (addTaskForm.dataset.mode === "Edit") {
                const taskId = addTaskForm.dataset.itemId;
                const newData = {
                    title: titleInput,
                    description: descInput,
                    dueDate: dueDateInput,
                    tags,
                }
                creationSuccess = todoController.updateTodoItem(taskId, newData);
            } else {
                console.warn("Incorrect form mode!");
            }


            addTaskForm.reset();
            dialogForm.close();

            initSidebarSections();

            //insert function to turn off btn styling
            turnOffAddBtn(newTaskBtn);

            // Display all tasks stored
            const section = lastClickedSection.dataset.section;
            let days = 0;

            switch (section) {
                case "Upcoming":
                    days = -1; // filter nothing and display all
                    uiController.displayTasks(days, false);
                    break;
                case "Today":
                    days = 0; // display today
                    uiController.displayTasks(days, false)
                    break;
                case "Completed":
                    days = -1; // display all that are completed
                    uiController.displayTasks(days, true);
                    break;
            }

            // sets back functionality to task buttons
            actionBtnEvents();
        })
    }

    // Event to open up add task form from sidebar button
    const newTaskShowEvent = () => {
        const newTaskBtn = document.getElementById("add-task");
        const addTaskForm = document.querySelector(".add-todo-form");

        newTaskBtn.addEventListener("click", () => {
            addTaskForm.dataset.mode = "Create";
            dialogForm.showModal();
        })
    }

    function getDisplayDate(dueDate) {
        if (!dueDate || dueDate === FAR_FUTURE) {
            return ""; // no date shown
        }

        // Try to normalize
        let parsed = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;

        if (!isValid(parsed)) {
            return ""; // invalid date -> skip
        }

        return format(parsed, "yyyy-MM-dd");
        }


    const openEditForm = (task, itemId) => {
        const addTaskForm = document.querySelector(".add-todo-form");

        // fill form fields with previous data
        document.getElementById("title-input").value = task.title;
        document.getElementById("description-input").value = task.description;
        
        const dueDate = getDisplayDate(task.dueDate);

        document.getElementById("date-input").value =  dueDate ? format(dueDate, "yyyy-MM-dd") : "";
        const tags = task.tags || [];
        document.getElementById("tags-input").checked = tags.includes("Important");
       
        // change to edit mode
        addTaskForm.dataset.mode = "Edit";
        addTaskForm.dataset.itemId = itemId;

        const editBtn = addTaskForm.querySelector(".submit-btn > button");
        editBtn.textContent = "Save Changes";

        dialogForm.showModal();
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


    // Makes clicking sidebar sections interactible
    function sidebarClickEvents() {
        const sidebarBtns = document.querySelectorAll(".sidebar-row > button");

        sidebarBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const clickedBtn = e.currentTarget;
                const section = clickedBtn.dataset.section;
                const svgChild = clickedBtn.querySelector("svg");

                if (section === "New") {
                    // keep previous button highlighted
                    if (lastClickedSection) {
                        lastClickedSection.style.color = activeColor;
                        const prevSvg = lastClickedSection.querySelector("svg");
                        if (prevSvg) prevSvg.style.fill = activeColor;
                        lastClickedSection.dataset.id = "displaying";
                    }

                    return; // don't run the rest of this logic
                }


                // If we already had a selected button, reset its color
                if (lastClickedSection && lastClickedSection !== clickedBtn) {
                    const prevSvg = lastClickedSection.querySelector("svg");
                    lastClickedSection.style.color = inactiveColor;
                    if (prevSvg) prevSvg.style.fill = inactiveColor;
                    lastClickedSection.dataset.id = "unfocused";
                }

                const isActive = clickedBtn.dataset.id === "displaying";

                if (isActive) {
                    // turn off
                    clickedBtn.style.color = inactiveColor;
                    if (svgChild) svgChild.style.fill = inactiveColor;
                    clickedBtn.dataset.id = "unfocused";
                    lastClickedSection = null;
                } else {
                    // turn on
                    clickedBtn.style.color = activeColor;
                    if (svgChild) svgChild.style.fill = activeColor;
                    clickedBtn.dataset.id = "displaying";
                    lastClickedSection = clickedBtn;
                }

                // Call display function to display selected section
                let days = 0;

                switch (section) {
                    case "Upcoming":
                        uiController.updateContentHeaders("Upcoming", "My Tasks");
                        days = -1; // filter nothing and display all
                        uiController.displayTasks(days, false);
                        break;
                    case "Today":
                        uiController.updateContentHeaders("Today", "Tasks For Today");
                        days = 0; // display today
                        uiController.displayTasks(days, false)
                        break;
                    case "Completed":
                        uiController.updateContentHeaders("Completed", "Finished Tasks");
                        days = -1; // display all that are completed
                        uiController.displayTasks(days, true);
                        break;
                }
            });
        });
    }


    // Meant to add functionality to every action btn in the task list
    const actionBtnEvents = () => {
        const taskContentParent = document.getElementById("content-section");

        taskContentParent.addEventListener(("click"), (e) => {
            const Btn = e.target.closest(".action-btn");
            if (!Btn) return; // click was not on a button

            const action = Btn.dataset.action;
            const taskId = Btn.dataset.taskId;
            const displayedSection = lastClickedSection.dataset.section;
            let completed = false;
            let days;

            // Figuring out which section to redisplay
            switch (displayedSection) {
                case "Upcoming":
                    days = -1;
                    completed = false;
                    break;
                case "Today":
                    days = 0; // display today
                    completed = false;
                    break;
                case "Completed":
                    days = -1;
                    completed = true;
                    break;
                default:
                // Fallback if a new/unknown section appears
                days = -1;
                completed = false;
                break;
            }

            switch (action) {
                case "Check":
                const isComplete = Btn.dataset.state === "complete";
                todoController.updateTodoItem(taskId, { completed: !isComplete });
                uiController.displayTasks(days, completed); // re-render
                break;

                case "Edit":
                // open edit form.
                const task = todoController.readTodoItem(taskId);
                openEditForm(task, taskId);
                break;

                case "Remove":
                todoController.deleteTodoItem(taskId);
                uiController.displayTasks(days, completed);
                break;
            }
        })
    }


    const openLoginForm = () => {
        const loginDialog = document.getElementById("login-dialog");
        loginDialog.showModal();
    }

    const handleLogins = (callback) => {
        // submissions
        const loginDialog = document.getElementById("login-dialog");
        const loginForm = document.getElementById("login-form");
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const userName = document.getElementById("user-logins").value.trim();

            setUserName(userName); // sets saved username
            loginForm.reset();
            loginDialog.close();
            if (callback) callback(userName);
        })
    }


    return {
        setEvents,
        openLoginForm,
        handleLogins,
    }
})();

