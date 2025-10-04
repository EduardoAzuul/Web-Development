/*
    Sieve of Eratosthenes - The sieve of Eratosthenes is one of the most efficient ways
    to find all of the smaller primes (below 10 million or so).
*/

// TODO: Adjust this script so it can work with the sieve.html file.

var sieve = function (n) {
  "use strict";

  var array = [],
    primes = [],
    i,
    j;

  for (i = 2; i <= n; i++) {
    array[i] = true;
  }

  for (i = 2; i * i <= n; i++) {
    if (array[i]) {
      // Marcar todos los múltiplos de i como no primos
      for (j = i * i; j <= n; j += i) {
        array[j] = false;
      }
    }
  }
  
  for (i = 2; i <= n; i++) {
    if (array[i]) {
      primes.push(i);
    }
  }
  // TODO: Implement the sieve of eratosthenes algorithm to find all the prime numbers under the given number.

  return primes;
};

// Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
  // Conectar el botón con la función
  document.getElementById("btn").addEventListener("click", function() {
    var num = parseInt(document.getElementById("num").value);
    
    // Validar que sea un número válido
    if (isNaN(num) || num < 2) {
      document.getElementById("primes").textContent = "Por favor ingresa un número mayor o igual a 2";
      return;
    }
    
    // Calcular los números primos
    var primes = sieve(num);
    
    // Mostrar los resultados
    document.getElementById("primes").textContent = primes.join(", ");
  });
});