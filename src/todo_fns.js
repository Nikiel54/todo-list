import { loadItemData, saveItemData, resetItemData } from "./database_queries.js";


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

    const addTodoItem = (item) => {
        const existsAlready = todos.some(todo =>
                compareTodoItems(item, todo)
        );

        if (existsAlready) { return false; }
        else {
            todos.push(item);
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

    return {
        init,
        createTodoItem,
        updateTodoItem,
        deleteTodoItem,
        resetMemory,
    }
})();
