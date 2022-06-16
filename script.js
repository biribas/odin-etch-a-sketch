let canvas = document.getElementById('canvas');
const range = document.querySelector('input[type="range"]');
const size = document.getElementById('size');

const menu = document.querySelectorAll('.button');

const actionButtons = [...menu].slice(0, 7);
const actionFunctions = [
  brush,
  bucket,
  eraser,
  eyedropper,
  shading,
  shading,
  rainbow
];

const backgroundIcon = menu[7];
const backgroundButton = document.querySelector('#background > input');
const gridButton = menu[8];
const clearButton = menu[9];
const colorIcon = menu[10];
const colorButton = document.querySelector('#color > input');

const info = {
  mousedown: false,
  currentColor: '#000000',
  currentBackgroundColor: '#ffffff',
  currentSize: 0
}

const toRGBArray = rgbString => rgbString.match(/\d+/g).map(Number);
const hexToRGB = hex => {
  const hexArray = hex.match(/[a-f\d]{2}/g);
  return [
    parseInt(hexArray[0], 16),
    parseInt(hexArray[1], 16),
    parseInt(hexArray[2], 16)
  ];
}

function changeSizeInfo() {
  size.innerHTML = `${range.value} x ${range.value}`;
}

function createSquares() {
  const start = Date.now();
  const n = +range.value;
  const gridIsSelected = gridButton.classList.contains('selected');

  canvas.innerHTML = '';
  for (let i = 0; i < n; i++) {
    canvas.innerHTML += '<div class="flex row"></div>';
    for (let j = 0; j < n; j++)
      canvas.lastElementChild.innerHTML += '<div class="square' + (gridIsSelected ? ' grid' : '') + `" data-coordinate="${i};${j}"></div>`;
  }
  console.log(Date.now() - start);
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
      return actionFunction(+coordinate[0], +coordinate[1], e.target.style.backgroundColor);
    });

  if (id === 'eyedropper')
    return canvas.addEventListener('click', e => actionFunction(e.target));

  canvas.addEventListener('mousedown', e => (info.mousedown = true, actionFunction(e.target)));
  canvas.addEventListener('mouseover', e => info.mousedown ? actionFunction(e.target) : 1);
  canvas.addEventListener('mouseup', () => info.mousedown = false);
}

function brush(target) {
  target.style.backgroundColor = info.currentColor;
  target.classList.add('scratched');
}

function bucket(i, j, oldColor) {
  if (i < 0 || i >= info.currentSize || j < 0 || j >= info.currentSize) 
    return;

  const square = canvas.querySelector(`[data-coordinate="${i};${j}"]`);

  if (square.style.backgroundColor !== oldColor)
    return;

  square.style.backgroundColor = info.currentColor;
  square.classList.add('scratched');

  bucket(i - 1, j, oldColor);
  bucket(i + 1, j, oldColor);
  bucket(i, j - 1, oldColor);
  bucket(i, j + 1, oldColor);
}

function eraser(target) {
  target.style.backgroundColor = info.currentBackgroundColor;
  target.dataset.shading = 0;
  target.classList.remove('scratched');
}

function eyedropper(target) {
  info.currentColor = getComputedStyle(target).getPropertyValue('background-color');
  colorIcon.style.color = info.currentColor;
}

function shading(target) {
  const sign = target.parentNode.id === 'shading' ? -1 : 1;
  console.log(sign);
  
  const rgbString = getComputedStyle(target).getPropertyValue('background-color');
  if (rgbString === 'rgb(0, 0, 0)')
    return;

  if (target.hasAttribute('data-shading'))
    target.dataset.shading = +target.dataset.shading + sign;
  else
    target.dataset.shading = sign;
  
  const rgbArray = toRGBArray(rgbString);
  const newRGBAray = rgbArray.map(e => (e + 15 * sign) < 0 ? 0 : e + 15 * sign);

  target.style.backgroundColor = `rgb(${newRGBAray[0]}, ${newRGBAray[1]}, ${newRGBAray[2]})`;
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
  colorIcon.style.color = this.value;
  info.currentColor = this.value;
}

function changeBackgroundColor() {
  info.currentBackgroundColor = this.value;
  backgroundIcon.style.color = this.value;
  for (let i = 0; i < info.currentSize; i++) 
    for (let j = 0; j < info.currentSize; j++) {
      const square = canvas.querySelector(`[data-coordinate="${i};${j}"]`);
      const isScratched = square.classList.contains('scratched');
      const isShaded = square.hasAttribute('data-shading') && square.dataset.shading !== '0';
      if (!isScratched && isShaded) {
        const shadeLevel = +square.dataset.shading * 15;
        const rgbArray = hexToRGB(info.currentBackgroundColor).map(e => (e + shadeLevel) < 0 ? 0 : e + shadeLevel);
        console.log(info.currentBackgroundColor)
        square.style.backgroundColor = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
      }
      else if (!isScratched)
        square.style.backgroundColor = info.currentBackgroundColor;
    }
}

function start() {
  changeSizeInfo();
  createSquares();
  addCanvasEventListener(actionButtons.indexOf(document.querySelector('.selected')));
}

function main() {
  start();
  range.addEventListener('input', changeSizeInfo);
  range.addEventListener('change', createSquares);
  actionButtons.forEach((button, index) => button.addEventListener('click', () => addCanvasEventListener(index)));
  gridButton.addEventListener('click', showGrid);
  colorButton.addEventListener('change', changeColor);
  backgroundButton.addEventListener('change', changeBackgroundColor);
}

document.addEventListener('DOMContentLoaded', main);