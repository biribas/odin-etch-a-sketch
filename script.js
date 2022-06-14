const canvas = document.getElementById('canvas');
const range = document.querySelector('input[type="range"]');
const size = document.getElementById('size');

const menu = document.querySelectorAll('.button');
const brush = menu[0];
const background = menu[1];
const rainbow = menu[2];
const shadding = menu[3];
const bucket = menu[4];
const eyedropper = menu[5];
const eraser = menu[6];
const grid = menu[7];
const clear = menu[8];

function createSquares() {
  const n = +range.value;
  const gridIsSelected = grid.classList.contains('selected');

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

function showGrid() {
  if (grid.classList.contains('selected')) {
    grid.classList.remove('selected');    
    document.querySelectorAll('.square').forEach(e => e.classList.remove('grid'));
    return;
  }
  
  grid.classList.add('selected');
  document.querySelectorAll('.square').forEach(e => e.classList.add('grid'));
}

function start() {
  changeSizeInfo();
  createSquares();
}

function main() {
  start();
  range.addEventListener('input', changeSizeInfo)
  range.addEventListener('change', createSquares);
  grid.addEventListener('click', showGrid)
}

document.addEventListener('DOMContentLoaded', main);