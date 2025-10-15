const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const axios = require("axios");
const FormData = require("form-data");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = "89be36d7fd6fa2ab7a3ac544b794b450";
const URL = "https://api.openweathermap.org/data/2.5/weather";

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    const city = req.body.cityName;
    const units = "metric";
    const url = `${URL}?q=${city}&appid=${API_KEY}&units=${units}`;

    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            res.send(`
                <h1>Error</h1>
                <p>Could not fetch weather data.</p>
                <a href="/">Back to home</a>
            `);
            return;
        }

    let data = "";

    response.on("data", (chunk) => {
        data += chunk;
    });

    response.on("end", () => {
        try {
        const weatherData = JSON.parse(data);

        if (weatherData.cod && weatherData.cod !== 200) {
            throw new Error(weatherData.message || "City not found");
        }

        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const cityName = weatherData.name;

        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.send(`
            <h1>Weather in ${cityName}</h1>
            <p>Temperature: ${temp}°C</p>
            <p>Description: ${description}</p>
            <img src="${iconUrl}" alt="${description}">
            <br>
            <a href="/">Back to home</a>
        `);
        } catch (error) {
            res.send(`
                <h1>Error</h1>
                <p>${error.message}</p>
                <a href="/">Back to home</a>
            `);
        }
    });

    }).on("error", (error) => {
        res.send(`
            <h1>Connection Error</h1>
            <p>${error.message}</p>
            <a href="/">Back to home</a>
        `);
    });
});

app.listen(3000, () => {
    console.log("Listening to port 3000");
});