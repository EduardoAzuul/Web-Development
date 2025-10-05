console.log("Hello World!");

const superheroes = require('superheroes');
const supervillains = require('supervillains');
const sw = require('star-wars-quotes');

console.log(sw()); // Devuelve una cita aleatoria de Star Wars

const hero = superheroes.randomSuperhero();       // Devuelve un héroe aleatorio
const villain = supervillains.randomSupervillain(); // Devuelve un villano aleatorio

console.log(`Hero: ${hero}`);  
console.log(`Villain: ${villain}`);

const fs = require('fs');
console.log(fs.readFileSync('./data/input.txt', 'utf8')); 


// Devuelve una cita aleatoria de Star Wars