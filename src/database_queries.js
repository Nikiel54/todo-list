export function loadItemData() {
    const storedItems = localStorage.getItem("todos");
    const itemsJson = JSON.parse(storedItems);
    return itemsJson;
}   

export function saveItemData(todos) {
    const todoItemArray = JSON.stringify(todos);
    localStorage.setItem("todos", todoItemArray);
}