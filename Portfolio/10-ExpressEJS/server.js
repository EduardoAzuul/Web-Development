const express = require("express");
const app = express();
const https = require("https");


const path = require("path");
const bodyParser = require("body-parser");



// TO DO: configure the express server
//Alows the use of static content
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

const port = 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

let posts = [];
let name = null;

app.get("/", (req, res) => {
  res.render("index");
});


// app.post("/login", (req, res) => {
//   const userName = req.body.name;
//   res.send(`
//     <h1>Hello, ${userName}!</h1>
//     <p>Security level: <strong>SECURED (POST)</strong></p>
//     <a href="/">Go back</a>
//   `);
// });

app.post("/login", (req, res) => {
  name = req.body.name;
  //res.render("test", { name: name });
  res.redirect("/home");
});


app.get("/home", (req, res) => {
  //No user, go back to login
  if (!name) {
    return res.redirect("/");
  }
  res.render("home", { name: name, posts: posts });
});

app.post("/post", (req, res) => {
  if (!name) {
    return res.redirect("/");
  }
  
  const newPost = {
    title: req.body.title,
    content: req.body.content
  };
  
  posts.push(newPost);
  res.redirect("/home");
});

app.get("/post/:id", (req, res) => {
  if (!name) {
    return res.redirect("/");
  }
  
  const postId = req.params.id;
  const post = posts[postId];
  
  if (!post) {
    return res.redirect("/home");
  }
  
  res.render("post", { name: name, post: post, postId: postId });
});

app.post("/post/:id/edit", (req, res) => {
  if (!name) {
    return res.redirect("/");
  }
  
  const postId = req.params.id;
  
  if (posts[postId]) {
    posts[postId].title = req.body.title;
    posts[postId].content = req.body.content;
  }
  
  res.redirect("/post/" + postId);
});

app.post("/post/:id/delete", (req, res) => {
  if (!name) {
    return res.redirect("/");
  }
  
  const postId = req.params.id;
  posts.splice(postId, 1);
  res.redirect("/home");
});


app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});