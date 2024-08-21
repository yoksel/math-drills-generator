const drillsElement = document.getElementById( 'drills' );
const minValueElement = document.getElementById('min');
const maxValueElement = document.getElementById('max');
const opAddElement = document.getElementById('add');
const opSubElement = document.getElementById('sub');
const opMultElement = document.getElementById('mult');
const opDivElement = document.getElementById('div');
const perPageElement = document.getElementById('per-page');
const randElement = document.getElementById('rand');

const MIN = 1;
const MAX = 12;
const PER_PAGE = 54;
const MAX_PAGES = 50;
const MAX_ITEMS = PER_PAGE * MAX_PAGES;

fillInputsByValuesFromUrl();
fillDrills();

minValueElement.addEventListener('input', onChange);
maxValueElement.addEventListener('input', onChange);
opAddElement.addEventListener('input', onChange);
opSubElement.addEventListener('input', onChange);
opMultElement.addEventListener('input', onChange);
opDivElement.addEventListener('input', onChange);
perPageElement.addEventListener('change', onChange);
randElement.addEventListener('change', onChange);

function fillDrills() {
  const exercisesSet = new Set();
  const min = getNumValueFromInput(minValueElement.value) || MIN;
  const max = getNumValueFromInput(maxValueElement.value) || MAX;
  const perPageValue = getNumValueFromInput(perPageElement?.value) || PER_PAGE;
  const isRandom = randElement.checked;

  drillsElement.style = `--rows: ${perPageValue / 3}`;

  for (let i = min; i <= max; i++) {
    for (let k = min; k <= max; k++) {
      // Addition
      if (opAddElement.checked === true){
        exercisesSet.add(`${i} + ${k}`);
      }
      // Multiplication
      if (opMultElement.checked === true){
        exercisesSet.add( `${i} x ${k}` );
      }
      // Division
        if(opDivElement.checked === true) {
          exercisesSet.add( `${k * i} &#247; ${i}` );

          if(k !== i) {
            exercisesSet.add( `${k * i} &#247; ${k}` );
          }
        }

      if (k  > i) {
        // Substraction
        if (opSubElement.checked === true) {
          exercisesSet.add( `${k} &minus; ${i}` );
        }
      }
      else {
        // Substraction
        if (opSubElement.checked === true) {
          exercisesSet.add( `${i} &minus; ${k}` );
        }
      }
      if(exercisesSet.size >= MAX_ITEMS) {
         break;
      }
    }
  }

  const exercisesList = Array.from(exercisesSet);
  const orderedItems = isRandom ? shuffle(shuffle(exercisesList)) : exercisesList

  const listItems = orderedItems.map(item => `<li>${item} = </li>`);
  const listsByPages = [listItems.splice(0, perPageValue)];

  while(listItems.length > 0 && listsByPages.length < MAX_PAGES) {
    listsByPages.push(listItems.splice(0, perPageValue));
  }

  drillsElement.innerHTML = '';
  listsByPages.forEach(list =>
    drillsElement.insertAdjacentHTML( 'beforeend', `<ol>${list.join('')}</ol>` )
  );
}

// UTILS

function onChange(event) {
  const {id, value, type, checked} = event.target;
  const params = new URLSearchParams(location.search);
  if(type === 'checkbox'){
    params.set(id, checked)
  }
  else {
    params.set(id, value)
  }
  location.search = params.toString();
  // event.target
  // Location.search
  fillDrills();
}

function fillInputsByValuesFromUrl() {
  const params = new URLSearchParams(location.search);
  const min = getNumValueFromInput(params.get('min')) ?? MIN;
  const max = getNumValueFromInput(params.get('max')) ?? MAX;
  const perPageFromUrl = getNumValueFromInput(params.get('per-page')) ?? PER_PAGE;
  const perPage = perPageFromUrl > 24 ? perPageFromUrl : PER_PAGE;

  minValueElement.value = min > max ? max : min;
  maxValueElement.value = min > max ? min : max;
  opAddElement.checked = getBooleanValueFromInput(params.get('add')) ?? true;
  opSubElement.checked = getBooleanValueFromInput(params.get('sub')) ?? true;
  opMultElement.checked = getBooleanValueFromInput(params.get('mult')) ?? true;
  opDivElement.checked = getBooleanValueFromInput(params.get('div')) ?? true;
  randElement.checked = getBooleanValueFromInput(params.get('rand')) ?? true;

  perPageElement.value = perPage;
}

function getNumValueFromInput(inputValue) {
  if(isNaN(parseInt(inputValue))) return;

  return parseInt(inputValue);
}

function getBooleanValueFromInput(inputValue) {
  if(['true','false'].includes(inputValue)) return inputValue === 'true';
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
