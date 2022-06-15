const canvas = document.getElementById('canvas');
const range = document.querySelector('input[type="range"]');
const size = document.getElementById('size');

const menu = document.querySelectorAll('.button');
const actionButtons = [...menu].slice(0, 6);

const brushButton = menu[0];
const bucketButton = menu[1];
const eraserButton = menu[2];
const eyedropperButton = menu[3];
const shaddingButton = menu[4];
const rainbowButton = menu[5];
const backgroundButton = menu[6];
const gridButton = menu[7];
const clearButton = menu[8];

const colorImage = menu[9];
const colorButton = document.querySelector('#color > input');

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

function removeSelectedButton() {
  document.querySelector('.selected').classList.remove('selected');
  this.classList.add('selected');
}

function brush() {
  actionButtons.forEach(button => button.classList.remove('selected'));
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
}

function start() {
  changeSizeInfo();
  createSquares();
  changeColor();
}

function main() {
  start();
  range.addEventListener('input', changeSizeInfo);
  range.addEventListener('change', createSquares);
  actionButtons.forEach(button => button.addEventListener('click', removeSelectedButton));
  gridButton.addEventListener('click', showGrid);
  colorButton.addEventListener('change', changeColor);
}

document.addEventListener('DOMContentLoaded', main);