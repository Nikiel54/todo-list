export function loadItemData() {
    // prevents reading null storage
    try {
    const storedItems = localStorage.getItem("todos");
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (e) {
    console.error("Error loading todos:", e);
    return [];
  }
} 

export function saveItemData(todos) {
    const todoItemArray = JSON.stringify(todos);
    localStorage.setItem("todos", todoItemArray);
}

export function resetItemData() {
    localStorage.removeItem("todos");
    localStorage.setItem("currentUser", null);
}

export function setUserName(userName) {
  localStorage.setItem("currentUser", userName);
}