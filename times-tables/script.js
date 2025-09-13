const drillsElement = document.getElementById( 'drills' );
const randElement = document.getElementById('rand');
const repeatElement = document.getElementById('repeat');

const tableNumElements = document.getElementsByName('tables');
const statsElement = document.getElementById('stats');

console.log(tableNumElements)

const MIN = 1;
const MAX = 12;
const MAX_PAGES = 500;
const PER_PAGE = 54;

// fillInputsByValuesFromUrl();
fillDrills();

randElement.addEventListener('change', onChange);
repeatElement.addEventListener('change', onChange);
tableNumElements.forEach(tableNumElement => tableNumElement.addEventListener('change', onChange))

function fillDrills() {
  const isRandom = randElement.checked;
  const isRepeat = repeatElement.checked;
  const tablesValues = Array.from(tableNumElements).filter(({checked}) => checked).map(item => item.value )

  const drillsList = getTimesTablesList({tablesValues, isRandom});
  const listItems = drillsList.map(item => `<li>${item}</li>`);

  drillsElement.style = `--rows: 2; --cols: ${Math.round(listItems.length / 2)}`;
  // drillsElement.style = `--cols: ${Math.round(listItems.length / 2)}`;
  drillsElement.innerHTML = '';
  drillsElement.insertAdjacentHTML( 'beforeend', `<ol class="times-tables-list">${listItems.join('')}</ol>` )

  if(isRepeat) {
    drillsElement.insertAdjacentHTML( 'beforeend', `<ol class="times-tables-list">${listItems.join('')}</ol>` )
  }
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
  randElement.checked = getBooleanValueFromInput(params.get('rand')) ?? true;
}

function getNumValueFromInput(inputValue) {
  if(isNaN(parseInt(inputValue))) return;

  return parseInt(inputValue);
}

function getBooleanValueFromInput(inputValue) {
  if(['true','false'].includes(inputValue)) return inputValue === 'true';
}

function getTimesTablesList({tablesValues, isRandom}) {
  const exercisesList = tablesValues.map(item => {
    const list = [];

    for(let i = 1; i <= 12; i++) {
      if(randElement.checked && i === 1) continue;

      list.push(`<li>${i < 10 ? '&nbsp;&nbsp;': ''}${i} x ${item} = ___</li>`)
    }
    const orderedList = isRandom ? shuffle(list) : list;

    return `<ul class="times-table">${orderedList.join('\n')}</ul>`
  });

  return exercisesList;
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
