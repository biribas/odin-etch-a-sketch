const canvas = document.getElementById('canvas');
const range = document.querySelector('input[type="range"]');
const size = document.getElementById('size');

const menu = document.querySelectorAll('.button');
const brushButton = menu[0];
const backgroundButton = menu[1];
const rainbowButton = menu[2];
const shaddingButton = menu[3];
const bucketButton = menu[4];
const eyedropperButton = menu[5];
const eraserButton = menu[6];
const gridButton = menu[7];
const clearButton = menu[8];

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

function changeSizeInfo() {
  size.innerHTML = `${range.value} x ${range.value}`;
}

function brush() {  
  brushButton.classList.add('selected');
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

function start() {
  changeSizeInfo();
  createSquares();
}

function main() {
  start();
  range.addEventListener('input', changeSizeInfo);
  range.addEventListener('change', createSquares);
  brushButton.addEventListener('click', brush);
  gridButton.addEventListener('click', showGrid);
}

document.addEventListener('DOMContentLoaded', main);