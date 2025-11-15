const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const { Parser } = require("json2csv");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
app.set("views", __dirname + "/public/views");

const mongoUrl = "mongodb://127.0.0.1:27017/f1";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// -------------------- Static Data --------------------
let countries = [
  { code: "ENG", label: "England" },
  { code: "SPA", label: "Spain" },
  { code: "GER", label: "Germany" },
  { code: "FRA", label: "France" },
  { code: "MEX", label: "Mexico" },
  { code: "AUS", label: "Australia" },
  { code: "FIN", label: "Finland" },
  { code: "NET", label: "Netherlands" },
  { code: "CAN", label: "Canada" },
  { code: "MON", label: "Monaco" },
  { code: "THA", label: "Thailand" },
  { code: "JAP", label: "Japan" },
  { code: "CHI", label: "China" },
  { code: "USA", label: "USA" },
  { code: "DEN", label: "Denmark" },
];

let teams = [
  { code: "mercedes", label: "Mercedes" },
  { code: "aston_martin", label: "Aston Martin" },
  { code: "alpine", label: "Alpine" },
  { code: "hass_f1", label: "Hass F1 Team" },
  { code: "red_bull", label: "Red Bull Racing" },
  { code: "alpha_tauri", label: "Alpha Tauri" },
  { code: "alpha_romeo", label: "Alpha Romeo" },
  { code: "ferrari", label: "Ferrari" },
  { code: "williams", label: "Williams" },
  { code: "mc_laren", label: "McLaren" },
];

// -------------------- MongoDB Schemas --------------------
const teamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  nationality: String,
  url: String,
});
teamSchema.set("strictQuery", true);

const driverSchema = new mongoose.Schema({
  num: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
  team: String,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

// -------------------- CSV Data --------------------
let drivers = [];
const csvPath = "./public/data/f1_2023.csv";

if (!fs.existsSync(csvPath)) {
  console.error("❌ CSV file not found:", csvPath);
} else {
  console.log("📂 Reading CSV from:", csvPath);

 fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => {
    // Normaliza los nombres del CSV para mayor consistencia
    drivers.push({
      num: row.number,
      code: row.code,
      forename: row.forename,
      surname: row.surname,
      dob: row.dob,
      nationality: row.nationality,
      url: row.url,
      team: row.current_team,
    });
  })
  .on("end", () => {
    console.log("✅ CSV loaded successfully");
    console.log("📊 Total drivers loaded:", drivers.length);
    if (drivers.length > 0) {
      console.log("🧩 Example driver:", drivers[0]);
    }
  })
  .on("error", (err) => {
    console.error("⚠️ Error reading CSV:", err);
  });

}

// -------------------- Routes --------------------
app.get("/", (req, res) => {
  console.log("📍 Route accessed: /");
  
  const editCode = req.query.edit;
  let driverToEdit = null;
  
  if (editCode) {
    driverToEdit = drivers.find(d => d.code === editCode);
    console.log("📝 Editing driver:", driverToEdit);
  }
  
  // IMPORTANTE: Siempre pasar driverToEdit, aunque sea null
  res.render("home", { 
    teams, 
    countries, 
    driverToEdit: driverToEdit 
  });
});

app.get("/drivers", (req, res) => {
  console.log("📍 Route accessed: /drivers");
  console.log("📊 Current driver count:", drivers.length);
  res.render("drivers", { drivers });
});

app.post("/drivers", async (req, res) => {
  console.log("📍 Route accessed: /drivers [POST]");
  const driverData = req.body;
  console.log("📝 New driver data received:", driverData);

  try {
    // Busca el equipo (ajusta si tu form manda 'teamCode' en lugar de 'team')
    const team = await Team.findOne({
      $or: [
        { name: driverData.team },
        { code: driverData.team }
      ]
    });

    // Crea un nuevo driver con todos los campos del formulario
    const newDriver = new Driver({
      num: driverData.num,
      code: driverData.code,
      forename: driverData.name,
      surname: driverData.lname,
      dob: new Date(driverData.dob),
      nationality: driverData.nation,
      url: driverData.url,
      team: driverData.team
    });

    await newDriver.save();
    console.log("✅ Driver saved to DB:", newDriver);
    appendDriverToCSV(newDriver);

    drivers.push({
      number: newDriver.num,
      code: newDriver.code,
      forename: newDriver.forename,
      surname: newDriver.surname,
      dob: newDriver.dob.toISOString().split("T")[0],
      nationality: newDriver.nationality,
      url: newDriver.url,
      current_team: team?.name || driverData.team,
    });

    res.redirect("/drivers");
  } catch (err) {
    console.error("❌ Error saving driver to DB:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/drivers/update", async (req, res) => {
  console.log("📍 Route accessed: /drivers/update [POST]");
  const driverData = req.body;
  const originalCode = driverData.originalCode;
  console.log("📝 Updating driver:", originalCode, "with data:", driverData);

  try {
    // Busca el equipo por código
    const teamObj = teams.find(t => t.code === driverData.team);
    const teamName = teamObj ? teamObj.label : driverData.team;

    // Actualizar en MongoDB
    await Driver.updateOne(
      { code: originalCode },
      {
        $set: {
          num: driverData.num,
          code: driverData.code,
          forename: driverData.name,
          surname: driverData.lname,
          dob: new Date(driverData.dob),
          nationality: driverData.nation,
          url: driverData.url,
          team: teamName
        }
      }
    );

    // Actualizar en el array de drivers
    const driverIndex = drivers.findIndex(d => d.code === originalCode);
    if (driverIndex !== -1) {
      drivers[driverIndex] = {
        num: driverData.num,
        code: driverData.code,
        forename: driverData.name,
        surname: driverData.lname,
        dob: new Date(driverData.dob).toISOString().split("T")[0],
        nationality: driverData.nation,
        url: driverData.url,
        team: teamName,
      };
    }

    // Actualizar el CSV
    updateCSV();

    console.log("✅ Driver updated successfully");
    res.redirect("/drivers");
  } catch (err) {
    console.error("❌ Error updating driver:", err);
    res.status(500).send("Internal Server Error");
  }
});

function updateCSV() {
  const csvPath = "./public/data/f1_2023.csv";
  
  // Crea el header
  const header = "number,code,forename,surname,dob,nationality,url,current_team\n";
  
  // Crea todas las líneas
  const lines = drivers.map(driver => {
    return [
      driver.num,
      driver.code,
      driver.forename,
      driver.surname,
      driver.dob,
      driver.nationality,
      driver.url,
      driver.team
    ].join(',');
  }).join('\n');
  
  // Escribe el archivo completo
  fs.writeFile(csvPath, header + lines, (err) => {
    if (err) {
      console.error("❌ Error updating CSV:", err);
    } else {
      console.log("✅ CSV updated successfully.");
    }
  });
}

function appendDriverToCSV(driver) {
  const csvPath = "./public/data/f1_2023.csv";
  
  // Convierte solo las propiedades que quieres guardar
  const newDriver = {
    number: driver.num,
    code: driver.code,
    forename: driver.forename,
    surname: driver.surname,
    dob: driver.dob instanceof Date ? driver.dob.toISOString().split("T")[0] : driver.dob,
    nationality: driver.nationality,
    url: driver.url,
    current_team: driver.team?.name || driver.team || "Unknown",
  };

  appendDriverToCSV(newDriver);
}


function appendDriverToCSV(driver) {
  const csvPath = "./public/data/f1_2023.csv";
  
  // Construye la línea CSV manualmente
  const csvLine = [
    driver.num,
    driver.code,
    driver.forename,
    driver.surname,
    driver.dob instanceof Date ? driver.dob.toISOString().split("T")[0] : driver.dob,
    driver.nationality,
    driver.url,
    driver.team
  ].join(',');

  // Agrega una nueva línea
  fs.appendFile(csvPath, "\n" + csvLine, (err) => {
    if (err) {
      console.error("❌ Error writing to CSV:", err);
    } else {
      console.log("✅ Driver appended to CSV successfully.");
    }
  });
}
// -------------------- Server --------------------
app.listen(3000, (err) => {
  if (err) console.error("❌ Error starting server:", err);
  else console.log("🚀 Listening on http://localhost:3000");
});
