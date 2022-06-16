let canvas = document.getElementById('canvas');
const range = document.querySelector('input[type="range"]');
const size = document.getElementById('size');

const menu = document.querySelectorAll('.button');

const actionButtons = [...menu].slice(0, 6);
const actionFunctions = [
  brush,
  bucket,
  eraser,
  eyedropper,
  shadding,
  rainbow
];

const gridButton = menu[6];
const clearButton = menu[7];
const colorImage = menu[8];
const colorButton = document.querySelector('#color > input');


const info = {
  mousedown: false,
  currentColor: 'black',
  currentSize: 0
}

function changeSizeInfo() {
  size.innerHTML = `${range.value} x ${range.value}`;
}

function createSquares() {
  const n = +range.value;
  const gridIsSelected = gridButton.classList.contains('selected');

  canvas.innerHTML = '';
  for (let i = 0; i < n; i++) {
    canvas.innerHTML += '<div class="flex row"></div>';
    for (let j = 0; j < n; j++)
      canvas.lastElementChild.innerHTML += '<div class="square' + (gridIsSelected ? ' grid' : '') + `" data-coordinate="${i};${j}"></div>`;
  }

  info.currentSize = n;
}

function addCanvasEventListener(index) {
  document.querySelector('.selected').classList.remove('selected');
  
  const button = actionButtons[index];
  const actionFunction = actionFunctions[index];

  button.classList.add('selected');
  const id = button.parentNode.id;

  canvas.replaceWith(canvas.cloneNode(true));
  canvas = document.getElementById('canvas');

  if (id === 'bucket')
    return canvas.addEventListener('mousedown', e => {
      const coordinate = e.target.dataset.coordinate.split(';');
      return actionFunction(coordinate[0], coordinate[1], e.target.style.backgroundColor);
    });

  if (id === 'eyedropper')
    return canvas.addEventListener('click', e => actionFunction(e.target));

  canvas.addEventListener('mousedown', e => (info.mousedown = true, actionFunction(e.target)));
  canvas.addEventListener('mouseover', e => info.mousedown ? actionFunction(e.target) : 1);
  canvas.addEventListener('mouseup', () => info.mousedown = false);
}

function brush(target) {
  target.style.backgroundColor = info.currentColor;
}

function bucket(i, j, oldColor) {
  if (+i < 0 || +i >= info.currentSize || +j < 0 || +j >= info.currentSize) 
    return;

  const square = canvas.querySelector(`[data-coordinate="${i};${j}"]`);
    
  if (square.style.backgroundColor !== oldColor)
    return;
    
  square.style.backgroundColor = info.currentColor;

  bucket(+i - 1, +j, oldColor);
  bucket(+i + 1, +j, oldColor);
  bucket(+i, +j - 1, oldColor);
  bucket(+i, +j + 1, oldColor);
}

function eraser() {

}

function eyedropper() {

}

function shadding() {

}

function rainbow() {

}

function showGrid() {
  if (gridButton.classList.contains('selected')) {
    gridButton.classList.remove('selected');    
    document.querySelectorAll('.square').forEach(e => e.classList.remove('grid'));
    return;
  }
  
  gridButton.classList.add('selected');
  document.querySelectorAll('.square').forEach(e => e.classList.add('grid'));
}

function changeColor() {
  colorImage.style.color = colorButton.value;
  info.currentColor = colorButton.value;
}

function start() {
  changeSizeInfo();
  createSquares();
  changeColor();
  addCanvasEventListener(actionButtons.indexOf(document.querySelector('.selected')));
}

function main() {
  start();
  range.addEventListener('input', changeSizeInfo);
  range.addEventListener('change', createSquares);
  actionButtons.forEach((button, index) => button.addEventListener('click', () => addCanvasEventListener(index)));
  gridButton.addEventListener('click', showGrid);
  colorButton.addEventListener('change', changeColor);
}

document.addEventListener('DOMContentLoaded', main);