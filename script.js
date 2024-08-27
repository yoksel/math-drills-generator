const drillsElement = document.getElementById( 'drills' );
const minValueElement = document.getElementById('min');
const maxValueElement = document.getElementById('max');
const opAddElement = document.getElementById('add');
const opSubElement = document.getElementById('sub');
const opMultElement = document.getElementById('mult');
const opDivElement = document.getElementById('div');
const perPageElement = document.getElementById('per-page');
const randElement = document.getElementById('rand');
const statsElement = document.getElementById('stats');

const MIN = 1;
const MAX = 12;
const MAX_PAGES = 500;
const PER_PAGE = 54;

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
  const min = getNumValueFromInput(minValueElement.value) || MIN;
  const max = getNumValueFromInput(maxValueElement.value) || MAX;
  const perPageValue = getNumValueFromInput(perPageElement?.value) || PER_PAGE;
  const isRandom = randElement.checked;
  const maxItems = perPageValue * MAX_PAGES;

  const drillsList = isRandom ? getDrillsByRandomOrder(min, max, maxItems) : getDrillsByNormalOrder(min, max, maxItems);
  const listItems = drillsList.map(item => `<li>${item} = </li>`);

  const listsByPages = [listItems.splice(0, perPageValue)];


  while(listItems.length > 0 && listsByPages.length < MAX_PAGES) {
    listsByPages.push(listItems.splice(0, perPageValue));
  }

  const pages = drillsList.length ? `, pages: ${listsByPages.length}` : '';
  statsElement.innerHTML = `Items: ${drillsList.length}${pages}`;

  drillsElement.style = `--rows: ${perPageValue / 3}`;
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

  const paramsString = params.size > 0 ? `?${params.toString()}` : '';
  const url = location.origin + location.pathname + paramsString;

  history.pushState({}, '', url)
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

function getAction(action, i, k) {
  switch(action){
    // Addition
    case 'add':
      if (opAddElement.checked === true){
        return [`${i} + ${k}`];
      }
      break;
    case 'sub':
      // Substraction
      if (opSubElement.checked === true) {
        if (i >= k){
          return [`${i} &minus; ${k}`];
        }
        // to keep the same quantity of exercises in all groups
        else {
          return [`${k + i} &minus; ${i}`];
        }
      }
      break;
     case 'mult':
      // Multiplication
      if (opMultElement.checked === true){
        return [`${i} x ${k}`];
      }
      break;
    case 'div':
      // Division
      if (opDivElement.checked === true) {
        if(i >= k) {
          return [`${k * i} &#247; ${i}`];
        }
        // to keep the same quantity of exercises in all groups
        else {
          return [`${k * i} &#247; ${k}`];
        }
      }
      break;
    default:
      console.log('Unknown action ', action)
  }
}

function getDrillsByNormalOrder(min, max, maxItems) {
  const exercisesList = [];
  const counters = {
    add: 0,
    sub: 0,
    mult: 0,
    div: 0,
  };
  const actions = Object.keys(counters);

  for (let i = min; i <= max; i++) {
    for (let k = min; k <= max; k++) {
      actions.forEach(action => {
        if (getAction(action, i, k)) {
          exercisesList.push(...getAction(action, i, k));
          counters[action]++;
        };
      })

      if (exercisesList.length >= maxItems) {
        break;
      }
    }

    if (exercisesList.length >= maxItems) {
      break;
    }
  }

  return exercisesList;
}

function getDrillsByRandomOrder(min, max, maxItems) {
  const exercisesByAction = {
    add: [],
    sub: [],
    mult: [],
    div: []
  };
  let itemsCounter = 0;
  const actions = Object.keys(exercisesByAction);

  for (let i = min; i <= max; i++) {
    for (let k = min; k <= max; k++) {
      actions.forEach(action => {
        if (getAction(action, i, k)) {
          exercisesByAction[action].push(...getAction(action, i, k));
          itemsCounter++;
        };
      });

      if (itemsCounter >= maxItems) {
        break;
      }
    }

    if (itemsCounter >= maxItems) {
      break;
    }
  }

  const counters = {};
  Object.keys(exercisesByAction).forEach(key => counters[key] = exercisesByAction[key].length);

  return mergeSets(exercisesByAction);
}

function mergeSets(exercisesSetsByAction) {
  const mergedExercisesList = [];
  const itemsMaxLength = Math.max(...(Object.values(exercisesSetsByAction).map(set => set.length)));
  let currentIndex = 0;
  const exercisesGroupsList = Object.keys(exercisesSetsByAction)
    .map(key => {
    const list = exercisesSetsByAction[key];
    return shuffle(list);
  })
  // keep actions order: + - * /
  while (currentIndex < itemsMaxLength) {
      const existingValues = exercisesGroupsList.map(list => list[currentIndex]).filter(Boolean);
      mergedExercisesList.push(...existingValues)
    currentIndex++;
  }

  return mergedExercisesList
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
