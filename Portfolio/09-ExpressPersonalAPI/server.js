const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.render(__dirname + '/html/index.html', { names, error: null });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//Variables
let names = [];
let tasks = [];

app.get('/greet', (req, res) => {
    const name = req.query.name;
    if (name && name.trim() !== "" && !names.includes(name)) {
    names.push(name.trim());
    }

}); 