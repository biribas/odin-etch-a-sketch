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

const backgroundButton = menu[6];
const gridButton = menu[7];
const clearButton = menu[8];
const colorImage = menu[9];
const colorButton = document.querySelector('#color > input');


const info = {
  mousedown: false,
  currentColor: 'black'
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
      canvas.lastElementChild.innerHTML += '<div class="square' + (gridIsSelected ? ' grid' : '') + '"></div>';
  }
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
    return canvas.addEventListener('mousedown', e => actionFunction(e.target));

  if (id === 'eyedropper')
    return canvas.addEventListener('click', e => actionFunction(e.target));

  canvas.addEventListener('mousedown', e => (info.mousedown = true, actionFunction(e.target)));
  canvas.addEventListener('mouseover', e => info.mousedown ? actionFunction(e.target) : 1);
  canvas.addEventListener('mouseup', () => info.mousedown = false);
}

function brush(target) {
  
}

function bucket() {

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