import { loadItemData, saveItemData, resetItemData } from "./database_queries.js";
import { parseISO, isValid, compareAsc, differenceInDays, isBefore, startOfDay } from 'date-fns';
import { FAR_FUTURE } from "./eventHandlers.js";




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
            console.warn("Error: item already exists.");
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

    const readTodoItem = (itemId) => {
        const itemIndex = todos.findIndex(item => item.id == itemId);
        return todos[itemIndex];
    }

    const updateTodoItem = (itemId, newData) => {
        const itemIndex = todos.findIndex(item => item.id == itemId);
        if (itemIndex === -1) {
            return todos;
        }

        todos[itemIndex] = Object.assign(todos[itemIndex], newData);
        saveItemData(todos);
        return true;
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

    function parseDateSafe(dateValue) {
        // Convert stored strings or undefined to a valid Date
        if (!dateValue || dateValue === FAR_FUTURE) {
            return parseISO(FAR_FUTURE);
        }

        if (dateValue instanceof Date) {
            return dateValue;
        }

        const parsed = parseISO(dateValue);
        return isValid(parsed) ? parsed : parseISO(FAR_FUTURE);
    }

    const sortTodosByDueDate = () => {
        todos.sort((a, b) => {
            const aDate = parseDateSafe(a.dueDate);
            const bDate = parseDateSafe(b.dueDate);

            // Push long-term tasks (FAR_FUTURE) to the end
            if (a.dueDate === FAR_FUTURE && b.dueDate !== FAR_FUTURE) return 1;
            if (b.dueDate === FAR_FUTURE && a.dueDate !== FAR_FUTURE) return -1;

            return compareAsc(aDate, bDate);
        });
    }


    const filterOngoingTasks = (days, completed) => {
        // This filters by days
        const today = startOfDay(new Date());
        sortTodosByDueDate();
        let filteredTodos = todos;

        // filter on completion first
        if (completed === true) {
            filteredTodos = todos.filter(task => task.completed === true);
        }
        
        if (days < 0) {
            return filteredTodos;
        }

        filteredTodos = filteredTodos.filter(task => {
            const rawDate = task.dueDate;

            // Skip tasks with indefinite or missing date
            if (!rawDate || rawDate === "indefinite") return false;

            // Parse safely
            const parsedDate = rawDate instanceof Date ? rawDate : parseISO(rawDate);
            if (!isValid(parsedDate)) return false;

            // Skip if overdue
            if (isBefore(parsedDate, today)) return false;

            const storedDate = startOfDay(parsedDate);
            const daysLeft = differenceInDays(storedDate, today);
            return daysLeft <= days;
        });

            return filteredTodos;
        };

    return {
        init,
        createTodoItem,
        readTodoItem,
        updateTodoItem,
        deleteTodoItem,
        filterOngoingTasks,
        resetMemory,
    }
})();
