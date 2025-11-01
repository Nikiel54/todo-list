// This module denotes functions for rendering tasks on the screen
import { todoController } from "./todo_fns";
import { differenceInDays, format, parseISO, startOfDay } from "date-fns";
import { FAR_FUTURE } from "./eventHandlers";



export const uiController = (() => {
    // Svg templates
    const svgs = {
        uncheckedCircleSvg: `<svg class="check-box" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20px" height="20px"><path d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10,10,0,0,1,12,22Z"/></svg>`,
        checkedCircleSvg: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="m17.582,8.461c.573.597.555,1.547-.043,2.121l-4.605,4.424c-.668.659-1.552.989-2.438.989s-1.774-.33-2.451-.991l-1.547-1.388c-.616-.554-.667-1.502-.113-2.118.554-.615,1.5-.668,2.119-.113l1.592,1.43c.237.23.555.232.746.042l4.62-4.438c.597-.574,1.545-.557,2.121.042Zm6.418,3.539c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-3,0c0-4.962-4.037-9-9-9S3,7.038,3,12s4.037,9,9,9,9-4.038,9-9Z"/></svg>`,
        dateSvg: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="16px" height="16px"><path d="M24,7v1H0v-1C0,4.239,2.239,2,5,2h1V1c0-.552,.448-1,1-1h0c.552,0,1,.448,1,1v1h8V1c0-.552,.448-1,1-1h0c.552,0,1,.448,1,1v1h1c2.761,0,5,2.239,5,5Zm0,10c0,3.86-3.141,7-7,7s-7-3.14-7-7,3.141-7,7-7,7,3.14,7,7Zm-5,.586l-1-1v-1.586c0-.552-.448-1-1-1h0c-.552,0-1,.448-1,1v2c0,.265,.105,.52,.293,.707l1.293,1.293c.39,.39,1.024,.39,1.414,0h0c.39-.39,.39-1.024,0-1.414Zm-11-.586c0-2.829,1.308-5.35,3.349-7H0v9c0,2.761,2.239,5,5,5h6.349c-2.041-1.65-3.349-4.171-3.349-7Z"/></svg>`,
        editTaskSvg: `<svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="20px" height="20px"><path d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z"/><path d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z"/></svg>`,
        rmvTaskSvg: `<svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20px" height="20px"><path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/><path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/></svg>`,
    }

    // Function to create a task list divider
    function displayDivider() {
        const divider = document.createElement("div");
        divider.classList.add("divider");
        return divider;
    }


    // Function to create the html for a task item itself
    function createTaskContent(task) {
        // Div which contains all the displayed info
        const taskContentWrapper = document.createElement("div");
        taskContentWrapper.classList.add("task-content-wrapper");

        // Check complete Btn
        const checkTaskCompleteBtn = document.createElement("button");
        checkTaskCompleteBtn.classList.add("action-btn");
        checkTaskCompleteBtn.dataset.taskId = task.id;
        checkTaskCompleteBtn.dataset.action = "Check";

        // track state of completion
        if (task.completed == false) {
            checkTaskCompleteBtn.dataset.state = "incomplete";
            checkTaskCompleteBtn.insertAdjacentHTML("beforeend", svgs.uncheckedCircleSvg);
        } else {
            checkTaskCompleteBtn.dataset.state = "complete";
            checkTaskCompleteBtn.insertAdjacentHTML("beforeend", svgs.checkedCircleSvg);
        }

        taskContentWrapper.appendChild(checkTaskCompleteBtn);

        // Task content
        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const contentFirstLine = document.createElement("div");
        contentFirstLine.classList.add("content-first-line");
        
        // Title
        const title = document.createElement("h4");
        title.textContent = task.title;
        contentFirstLine.appendChild(title);

        // check if marked for tags
        if (task.tags.length > 0 && task.tags[0] === "Important") {
            const tag = document.createElement("h3");
            tag.classList.add("tag");
            tag.textContent = "Important";
            contentFirstLine.appendChild(tag);
        }

        // Display Due Date
        const dateDisplay = document.createElement("div");
        dateDisplay.classList.add("date-display");
        dateDisplay.insertAdjacentHTML("beforeend", svgs.dateSvg);
        
        // parse stored date into proper format
        let dateText = "";
        const dateContainer = document.createElement("p");

        if (task.dueDate == FAR_FUTURE || task.dueDate == "") {
            dateText = "long-term";
        } else {
            const today = startOfDay(new Date());
            const parsedStoredDate = parseISO(task.dueDate);
            const storedDate = startOfDay(parsedStoredDate);
            const timeLeft = differenceInDays(storedDate, today);

            const stdDate = format(task.dueDate, "MM/dd/yyyy");

            if (timeLeft < 0) {
                dateText = "Missed";
                dateContainer.style.color = "red";
            }
            if (timeLeft == 0) {
                dateText = "Due Today!";
            }
            else if (timeLeft > 0 && timeLeft <= 7) {
                dateText = `${timeLeft} days left`;
            } else {
                dateText = stdDate;
            }
        }

        dateContainer.textContent = dateText;
        dateDisplay.appendChild(dateContainer);
        contentFirstLine.appendChild(dateDisplay);


        // Lastly we append back to top div
        taskContent.appendChild(contentFirstLine);

        // Now we make div for second line
        const contentSecondLine = document.createElement("div");
        contentSecondLine.classList.add("content-second-line");

        // Filling in description
        const descriptionText = document.createElement("p");
        descriptionText.textContent = task.description;
        contentSecondLine.appendChild(descriptionText);

        taskContent.appendChild(contentSecondLine);
        taskContentWrapper.appendChild(taskContent);
        
        return taskContentWrapper;
    }


    // Function to create the html for the action buttons associated
    //   with each task item.
    function createTaskActions(task) {
        // div containing all action btns
        const taskActionsContainer = document.createElement("div");
        taskActionsContainer.classList.add("task-actions");

        // edit task btn
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-task-btn");
        editBtn.classList.add("action-btn");
        editBtn.insertAdjacentHTML("beforeend", svgs.editTaskSvg);
        editBtn.dataset.taskId = task.id;
        editBtn.dataset.action = "Edit";
        taskActionsContainer.appendChild(editBtn);

        // Remove task Btn
        const rmvBtn = document.createElement("button");
        rmvBtn.classList.add("action-btn");
        rmvBtn.classList.add("rmv-task-btn");
        rmvBtn.insertAdjacentHTML("beforeend", svgs.rmvTaskSvg);
        rmvBtn.dataset.taskId = task.id;
        rmvBtn.dataset.action = "Remove";
        taskActionsContainer.appendChild(rmvBtn);

        return taskActionsContainer;
    }


    // Function to string together all components to create and display a task item.
    function displayTask(task) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskContentContainer = createTaskContent(task);
        const taskActionsContainer = createTaskActions(task);

        taskItem.appendChild(taskContentContainer);
        taskItem.appendChild(taskActionsContainer);

        return taskItem;
    }



    // Modular function which displays all task items and their states (completed or not).
    const displayTasks = (days, completed) => {
        console.log("Inside ui controller now");
        const todoListObjs = todoController.filterOngoingTasks(days, completed);
        console.log(todoListObjs);
        const contentSection = document.getElementById("content-section");
        contentSection.innerHTML = ""; // reset list
        contentSection.appendChild(displayDivider());

        todoListObjs.forEach((task) => {
            // build html for the task and dividers then append to content section
            contentSection.appendChild(displayTask(task));
            contentSection.appendChild(displayDivider());
        })
    }

    const updateContentHeaders = (title, subTitle) => {
        const contentHeader = document.querySelector("#content-header h1");
        const contentSubHdr = document.querySelector(".content-section-hdr h2");

        contentHeader.textContent = title;
        contentSubHdr.textContent = subTitle;
    }


    const displayUser = (userName) => {
        const profileName = document.querySelector("#profile-section h1");
        profileName.textContent = userName;
    }


    return {
        displayTasks,
        updateContentHeaders,
        displayUser,
    }
})();




