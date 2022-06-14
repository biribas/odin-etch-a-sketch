const canvas = document.getElementById('canvas');
const range = document.querySelector('input[type="range"]');
const size = document.getElementById('size');

function createSquares() {
  const n = +range.value;
  canvas.innerHTML = '';
  for (let i = 0; i < n; i++) {
    canvas.innerHTML += '<div class="flex row"></div>';
    for (let j = 0; j < n; j++)
      canvas.lastElementChild.innerHTML += '<div class="square"></div>';
  }
}

function changeSizeInfo() {
  size.innerHTML = `${range.value} x ${range.value}`;
}

function start() {
  changeSizeInfo();
  createSquares();
}

function main() {
  start();
  range.addEventListener('input', changeSizeInfo)
  range.addEventListener('input', createSquares);
}

document.addEventListener('DOMContentLoaded', main);