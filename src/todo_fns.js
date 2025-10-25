import { loadItemData, saveItemData } from "./database_queries.js";


// CRUD operations for todo items
export const todoController = (() => {
    let todos = [];

    const init = () => {
        todos = loadItemData() || [];
        saveItemData(todos);
    }

    const createTodoItem = (title, description, dueDate, tags) => {
        const newItem = {
            id: "1",
            title,
            description,
            dueDate,
            completed: false,
            tags,
        };

        addTodoItem(newItem, todos);
    }

    const addTodoItem = (item) => {
        todos.push(item);
        saveItemData(todos);
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
        todos = [];
        saveItemData(todos);
    }

    return {
        init,
        createTodoItem,
        updateTodoItem,
        deleteTodoItem,
        resetMemory,
    }
})();
