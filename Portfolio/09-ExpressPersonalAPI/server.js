const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

//Variables
let names = [];
let tasks = [];
var shoppingList = ["Apples", "Bananas", "Carrots"];

//Routes
app.get("/", (req, res) => {
  res.render(__dirname + "/html/index.ejs", {
    names,
    tasks,
    error: null,
  });
});

app.get("/greet", (req, res) => {
  const name = req.query.name;
  if (name && name.trim() !== "" && !names.includes(name)) {
    names.push(name.trim());
  }
  res.redirect("/wazzup"); 
});

app.get("/greet/:index", (req, res, next) => {
  const index = parseInt(req.params.index);
  
  if (isNaN(index) || index < 0 || index >= names.length) {
    const error = new Error(`Invalid index: ${req.params.index}. Index out of range.`);
    error.status = 400;
    return next(error);
  }
  
  res.render(__dirname + "/html/wazzup.ejs", {
    name: names[index]
  });
});

app.put("/greet", (req, res, next) => {
  const name = req.body.name;
  if (name && name.trim() !== "" && !names.includes(name)) {
    names.push(name.trim());
  }
  res.json({ names });
    
});


app.get("/wazzup", (req, res) => {
  res.render(__dirname + "/html/index.ejs", {
    names,
    tasks,
    error: null
  });
});



app.post("/task/delete/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
  }
  res.redirect("/");
});

app.post("/task/up/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index > 0 && index < tasks.length) {
    [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
  }
  res.redirect("/");
});

app.post("/task/down/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < tasks.length - 1) {
    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
  }
  res.redirect("/");
});

app.post("/task", (req, res) => {
  const task = req.body.task;
  console.log("Task received:", task);
  if (task && task.trim() !== "") {
    tasks.push(task.trim());
  }
  console.log("Tasks array:", tasks);
  res.redirect("/"); 
});

// Agrega esto para verificar
console.log("POST /task route registered");

app.use((err, req, res, next) => {
  res.render(__dirname + "/html/index.ejs", {
    names,
    tasks,
    error: err.message || "An error occurred"
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});