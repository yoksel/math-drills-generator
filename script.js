const drillsElement = document.getElementById( 'drills' );
const minValueElement = document.getElementById('value-min');
const maxValueElement = document.getElementById('value-max');
const opAddElement = document.getElementById('op-add');
const opSubElement = document.getElementById('op-sub');
const opMultElement = document.getElementById('op-mult');
const opDivElement = document.getElementById('op-div');

const MIN = 1;
const MAX = 12;
minValueElement.value = MIN;
maxValueElement.value = MAX;

fillDrills();

minValueElement.addEventListener('input', fillDrills);
maxValueElement.addEventListener('input', fillDrills);
opAddElement.addEventListener('input', fillDrills);
opSubElement.addEventListener('input', fillDrills);
opMultElement.addEventListener('input', fillDrills);
opDivElement.addEventListener('input', fillDrills);

function fillDrills() {
  const exercisesList = [];
  const min = getValueFromInput(minValueElement.value) || MIN;
  const max = getValueFromInput(maxValueElement.value) || MAX;

  for (let i = min; i <= max; i++) {
    for (let k = min; k < max; k++) {
      // Addition
      if (opAddElement.checked === true){
        exercisesList.push(`${i} + ${k}`);
      }
      // Multiplication
      if (opMultElement.checked === true){
        exercisesList.push( `${i} x ${k}` );
      }
      if (k  > i) {
        // Substraction
        if (opSubElement.checked === true) {
          exercisesList.push( `${k} &minus; ${i}` );
        }
        // Division
        if(k % i === 0 && opDivElement.checked === true) {
          exercisesList.push( `${k} &#247; ${i}` );
        }
      }
      else {
        // Substraction
        if (opSubElement.checked === true) {
          exercisesList.push( `${i} &minus; ${k}` );
        }
        // Division
        if (i % k === 0 && opDivElement.checked === true) {
          exercisesList.push( `${i} &#247; ${k}` );
        }
      }
    }
  }

  const listItems = shuffle(shuffle(exercisesList)).map(item => `<li>${item} = </li>`);

  drillsElement.innerHTML = '';
  drillsElement.insertAdjacentHTML( 'beforeend', `<ol>${listItems.join('')}</ol>` )
}

// UTILS

function getValueFromInput(inputValue) {
  if(isNaN(inputValue)) return;

  const value = parseInt(inputValue);
  if (value <= 0) return;

  return value;
}

// https://stackoverflow.com/a/2450976
function shuffle( arraySrc ) {
  const array = [ ...arraySrc ];
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while ( currentIndex != 0 ) {

    // Pick a remaining element...
    let randomIndex = Math.floor( Math.random() * currentIndex );
    currentIndex--;

    // And swap it with the current element.
    [ array[ currentIndex ], array[ randomIndex ] ] = [
      array[ randomIndex ], array[ currentIndex ] ];
  }

  return array;
}
