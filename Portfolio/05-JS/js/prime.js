/*
    Prime Factorization - Have the user enter a number and find
    all Prime Factors (if there are any) and display them.
*/

var getPrimeFactors = function (n) {
  "use strict";

  function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    // Only check up to square root for efficiency
    for (var i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) {
            return false;
        } 
    }
    return true;
  }

  function getFactors(num) {
    const factors = [];
    let divisor = 2;

    while (num > 1) {
      if (num % divisor === 0 && isPrime(divisor)) {
        if(isPrime(divisor)){
          factors.push(divisor);
          num = num / divisor;
        }
      } else {
        divisor++;
      }
    }

    return factors;
  }
  

  let sequence = [];

  if(!isPrime(n)) {
    sequence = getFactors(n);
    console.log("factors of "+n+": "+sequence);
  } 
  else {
    sequence.push(n);
    console.log("PRIME, only prime factor is itself: " + n);
    return sequence;
  }


  //TODO: Check which numbers are factors of n and also check if
  // that number also happens to be a prime

  return sequence;
};

function showPrimeFactors() {
    var inputText = document.getElementById("num").value;
    var number = parseInt(inputText); // Convertir a número
    if (isNaN(number) || number < 1) {
        document.getElementById("pf").textContent = "Please enter a valid positive number.";
        return;
    }
    var primeFactors = getPrimeFactors(number);
    document.getElementById("pf").textContent = primeFactors.join(", ");
}


// the prime factors for this number are: [ 2, 3, 5, 7, 11, 13 ]
console.log(getPrimeFactors(30030)); // [2,3,5,7,11,13]
console.log(getPrimeFactors(60));    // [2,2,3,5]
console.log(getPrimeFactors(13));    // [13]
