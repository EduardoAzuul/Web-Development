const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true })); // Para datos de formularios
app.use(bodyParser.json()); // Para JSON

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/calculate-bmi", (req, res) => {
  const weight = parseFloat(req.query.weight);
  const height = parseFloat(req.query.height);

  console.log("Received weight:", weight, "height:", height);

  if (isNaN(weight) || isNaN(height) || height <= 0) {
    return res.status(400).send("Invalid input");
  }
  const bmi = weight / (height / 100) ** 2;
  res.send(`Your BMI is ${bmi.toFixed(2)}`);
});

app.post("/calculate-bmi", (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);

  console.log("Received weight:", weight, "height:", height);

  if (isNaN(weight) || isNaN(height) || height <= 0) {
    return res.status(400).send("Invalid input");
  }
  const bmi = weight / (height / 100) ** 2;
  res.send(`Your BMI is ${bmi.toFixed(2)}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
