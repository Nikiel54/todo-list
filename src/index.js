import "./styles.css";
import { loadItemData } from "./database_queries.js";
import { todoController } from "./todo_fns.js";

todoController.resetMemory()


let title = "Wash dishes";
let desc = "Or i will get beat";
let date = new Date().toISOString();
let tags = [];

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