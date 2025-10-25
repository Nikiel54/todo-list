import { loadItemData } from "./database_queries.js";
import "./styles.css";

import { todoController } from "./todo_fns.js";

todoController.resetMemory()
todoController.init();


let title = "Wash dishes";
let desc = "Or i will get beat";
let date = new Date().toISOString();
let tags = {};

todoController.createTodoItem(title, desc, date, tags);


/*
title = "Brush my room";
desc = "Make my room clean plz";
date = new Date().toISOString();
tags = {
}

todoController.createTodoItem(title, desc, date, tags);
*/

let list = loadItemData();
console.log(list);
console.log("Updating item now...");

const newParams = {
    title: "Who knows",
    description: "Man idk",
    tags: {
        important: true,
    }
}
todoController.updateTodoItem("1", newParams);
list = loadItemData();
console.log(list);