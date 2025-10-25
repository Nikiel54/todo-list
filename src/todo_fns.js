// CRUD operations for todo items

export const createTodoItem = (title, description, dueDate, tags) => {
    return {
        id: crypto.randomUUID(),
        title,
        description,
        dueDate,
        completed: false,
        tags,
    };
}

export const addTodoItem = (item, todos) => {
    todos.push(item);
    return todos;
}

export const updateTodoItem = (itemId, newData, todos) => {
    const itemIndex = todos.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        console.log("Error: Todo Item not found!");
        return todos;
    }

    todos[itemIndex] = Object.assign(todos[itemIndex], newData);
    return todos;
}

export const deleteTodoItem = (itemId, todos) => {
    return todos.filter(item => item !== itemId)
}