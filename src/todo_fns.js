import { loadItemData, saveItemData, resetItemData } from "./database_queries.js";
import { compareAsc, differenceInDays, isBefore } from 'date-fns';


// CRUD operations for todo items
export const todoController = (() => {
    let todos = [];

    const init = () => {
        todos = loadItemData() || [];
        saveItemData(todos);
    }

    const createTodoItem = (title, description, dueDate, tags) => {
        const newItem = {
            id: crypto.randomUUID(),
            title,
            description,
            dueDate,
            completed: false,
            tags,
        };

        const success = addTodoItem(newItem);
        // Can return true or false here as well to signal to UI modules if failure or success
        if (!success) {
            console.log("Error: item already exists.");
        } else {
            console.log("Succesful addition.");
        }
    }

    // function to maintain sorted order on tags to facilitate comparisons
    function normalizeTags(tags) {
        return [...new Set(tags.map(t => t.trim().toLowerCase()))].sort();
    }

    function compareTodoItems(item1, item2) {
        return item1.title.trim().toLowerCase() === item2.title.trim().toLowerCase() &&
            item1.description.trim().toLowerCase() === item2.description.trim().toLowerCase() &&
            item1.dueDate === item2.dueDate &&
            JSON.stringify(normalizeTags(item1.tags)) === JSON.stringify(normalizeTags(item2.tags));
    }

    function linearTaskInsertion(item) {
        const newTaskdate = item.dueDate;
        const n = todos.length;
        let inserted = false;

        for (let i = 0; i < n; ++i) {
            // found where to insert
            if (compareAsc(todos[i].dueDate, newTaskdate) === 1) {
                todos.splice(i, 0, item);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            todos.push(item);
        }
    }

    const addTodoItem = (item) => {
        // checking if task already exists, though unlikely.
        const existsAlready = todos.some(todo =>
                compareTodoItems(item, todo)
        );

        if (existsAlready) { return false; }
        else {
            linearTaskInsertion(item); // ensures sorted order
            saveItemData(todos);
            return true;
        }
    }

    const updateTodoItem = (itemId, newData) => {
        const itemIndex = todos.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            console.log("Error: Todo Item not found!");
            return todos;
        }

        todos[itemIndex] = Object.assign(todos[itemIndex], newData);
        saveItemData(todos);
    }

    const deleteTodoItem = (itemId) => {
        const newTodoList =  todos.filter(item => item.id !== itemId);
        todos = newTodoList;
        saveItemData(newTodoList);
    }

    // optional for clearing state
    const resetMemory = () => {
        resetItemData();
        init();
    }

    const filterOngoingTasks = (value) => {
        // This filters by days
        const today = new Date();

        let filteredTodos = todos.filter((task) => {
            if (isBefore(task.dueDate, today)) {
                return false;
            }
            // checks for long term tasks with no due date.
            else if (task.dueDate === "indefinite") {
                return false;
            }

            const daysLeft = differenceInDays(new Date(task.dueDate), today);

            if (daysLeft <= value) {
                return true;
            }
        })
        return filteredTodos // array containing tasks left to do within value days
    }

    return {
        init,
        createTodoItem,
        updateTodoItem,
        deleteTodoItem,
        filterOngoingTasks,
        resetMemory,
    }
})();
