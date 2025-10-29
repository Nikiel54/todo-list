// This module denotes functions for rendering tasks on the screen
import { todoController } from "./todo_fns";
import { format } from "date-fns";



export const uiController = (() => {
    // Svg templates
    const svgs = {
        checkCircleSvg: `<svg class="check-box" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20px" height="20px"><path d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10,10,0,0,1,12,22Z"/></svg>`,
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
        checkTaskCompleteBtn.insertAdjacentHTML("beforeend", svgs.checkCircleSvg);
        taskContentWrapper.appendChild(checkTaskCompleteBtn);

        // Task content
        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const textContent = document.createElement("div");
        
        // Title
        const title = document.createElement("h4");
        title.textContent = task.title;
        textContent.appendChild(title);

        // Display Due Date
        const dateDisplay = document.createElement("div");
        dateDisplay.classList.add("date-display");
        dateDisplay.insertAdjacentHTML("beforeend", svgs.dateSvg);
        
        // parse stored date into proper format
        const dateText = format(task.dueDate, "MM/dd/yyyy");
        const dateContainer = document.createElement("p");
        dateContainer.textContent = dateText;
        dateDisplay.appendChild(dateContainer);
        textContent.appendChild(dateDisplay);


        // Lastly we append back to top div and append description as well
        taskContent.appendChild(textContent);
        const descriptionText = document.createElement("p");
        descriptionText.textContent = task.description;
        taskContent.appendChild(descriptionText);
        taskContentWrapper.appendChild(taskContent);
        
        return taskContentWrapper;
    }


    // Function to create the html for the action buttons associated
    //   with each task item.
    function createTaskActions() {
        // div containing all action btns
        const taskActionsContainer = document.createElement("div");
        taskActionsContainer.classList.add("task-actions");

        // edit task btn
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-task-btn");
        editBtn.classList.add("action-btn");
        editBtn.insertAdjacentHTML("beforeend", svgs.editTaskSvg);
        taskActionsContainer.appendChild(editBtn);

        // Remove task Btn
        const rmvBtn = document.createElement("button");
        rmvBtn.classList.add("action-btn");
        rmvBtn.classList.add("rmv-task-btn");
        rmvBtn.insertAdjacentHTML("beforeend", svgs.rmvTaskSvg);
        taskActionsContainer.appendChild(rmvBtn);

        return taskActionsContainer;
    }


    // Function to string together all components to create and display a task item.
    function displayTask(task) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskContentContainer = createTaskContent(task);
        const taskActionsContainer = createTaskActions();

        taskItem.appendChild(taskContentContainer);
        taskItem.appendChild(taskActionsContainer);

        return taskItem;
    }



    // Modular function which displays all task items and their states (completed or not).
    const displayAllTasks = () => {
        const allDays = -1;
        const todoListObjs = todoController.filterOngoingTasks(allDays);
        const contentSection = document.getElementById("content-section");


        todoListObjs.forEach((task) => {
            // build html for the task and dividers then append to content section
            contentSection.appendChild(displayTask(task));
            contentSection.appendChild(displayDivider());
        })
    }



    return {
        displayAllTasks,
    }
})();




