/*
Pig Latin
*/

function igpayAtinlay(str) {
  // TODO: Initialize the word array properly

  var returnArray = [],
  wordArray = str.split(" ");
  console.log(wordArray);

  // TODO: make sure that the output is being properly built to produce the desired result.
  for (var i = 0; i < wordArray.length; i++) {
    var word = wordArray[i];
    var beginning = word.charAt(0);
    var firstVowelIndex = 0;

    for (var ii = 0; ii < word.length; ii++) {
      if (/[aeiouAEIOU]/.test(word.charAt(ii))) {
        firstVowelIndex = ii;
        console.log("First vowel index: " + firstVowelIndex);
        break;
      } else {
        beginning += word.charAt(ii);
      }
    }

    if (firstVowelIndex === 0) {
      returnArray.push(word + "way");
    } else {
      // Mueve las consonantes iniciales al final y agrega "ay"
      var pigWord = word.slice(firstVowelIndex) + word.slice(0, firstVowelIndex) + "ay";
      returnArray.push(pigWord);
    }
    
  }
  return returnArray.join(" ");
}

function showPigLatin() {
    var inputText = document.getElementById("txtVal").value;
    var pigText = igpayAtinlay(inputText);
    document.getElementById("pigLatLbl").textContent = pigText;
}

// Some examples of expected outputs
console.log(igpayAtinlay("pizza")); // "izzapay"
console.log(igpayAtinlay("apple")); // "appleway"
console.log(igpayAtinlay("happy meal")); // "appyhay ealmay"
