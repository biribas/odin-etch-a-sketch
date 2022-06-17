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
  lighting,
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
const hexToRGBArray = hex => {
  const hexArray = hex.match(/[a-f\d]{2}/g);
  return [
    parseInt(hexArray[0], 16),
    parseInt(hexArray[1], 16),
    parseInt(hexArray[2], 16)
  ];
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
  target.removeAttribute('data-brightness');
  target.classList.add('scratched');
}

function bucket(i, j, oldColor) {
  if (i < 0 || i >= info.currentSize || j < 0 || j >= info.currentSize) 
    return;

  const square = canvas.querySelector(`[data-coordinate="${i};${j}"]`);

  if (square.style.backgroundColor !== oldColor)
    return;

  square.style.backgroundColor = info.currentColor;
  square.removeAttribute('data-brightness');
  square.classList.add('scratched');

  bucket(i - 1, j, oldColor);
  bucket(i + 1, j, oldColor);
  bucket(i, j - 1, oldColor);
  bucket(i, j + 1, oldColor);
}

function eraser(target) {
  target.style.backgroundColor = info.currentBackgroundColor;
  target.removeAttribute('data-brightness');
  target.classList.remove('scratched');
}

function eyedropper(target) {
  info.currentColor = getComputedStyle(target).getPropertyValue('background-color');
  colorIcon.style.color = info.currentColor;
}

function shading(target) {
  changeBrightness(target, -1);
}

function lighting(target) {
  changeBrightness(target, 1);
}

function changeBrightness(target, sign) {
  const rgbString = getComputedStyle(target).getPropertyValue('background-color');
  const bound = sign === 1 ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'

  if (rgbString === bound)
    return;

  if (!target.hasAttribute('data-brightness'))
    target.dataset.brightness = sign;
  else
    target.dataset.brightness = +target.dataset.brightness + sign;
  
  const rgbArray = toRGBArray(rgbString);
  const newRGBAray = rgbArray.map(e => (e + 15 * sign) < 0 ? 0 : e + 15 * sign);

  target.style.backgroundColor = `rgb(${newRGBAray[0]}, ${newRGBAray[1]}, ${newRGBAray[2]})`;
}

function rainbow(target) {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  target.classList.add('scratched');
}

function changeBackgroundColor() {
  info.currentBackgroundColor = this.value;
  backgroundIcon.style.color = this.value;

  for (let i = 0; i < info.currentSize; i++) {
    for (let j = 0; j < info.currentSize; j++) {
      const square = canvas.querySelector(`[data-coordinate="${i};${j}"]`);
      const isScratched = square.classList.contains('scratched');
      const isShadedOrLightened = square.hasAttribute('data-brightness') && square.dataset.brightness !== '0';

      if (!isScratched && isShadedOrLightened) {
        const brightnessLevel = +square.dataset.brightness * 15;
        const rgbArray = hexToRGBArray(info.currentBackgroundColor).map(e => (e + brightnessLevel) < 0 ? 0 : e + brightnessLevel);
        square.style.backgroundColor = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
      }
      else if (!isScratched)
        square.style.backgroundColor = info.currentBackgroundColor;
    }
  }
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

function clearAll() {
  for (let i = 0; i < info.currentSize; i++) {
    for (let j = 0; j < info.currentSize; j++) {
      const square = canvas.querySelector(`[data-coordinate="${i};${j}"]`);
      square.classList.remove('scratched');
      square.removeAttribute('data-brightness');
      square.style.backgroundColor = info.currentBackgroundColor;
    }
  }
}

function changeColor() {
  colorIcon.style.color = this.value;
  info.currentColor = this.value;
}

function changeSizeInfo() {
  size.innerHTML = `${range.value} x ${range.value}`;
}

function createSquares() {
  const n = +range.value;
  info.currentSize = n;
  const gridIsSelected = gridButton.classList.contains('selected');
  
  canvas.innerHTML = '';
  for (let i = 0; i < n; i++) {
    canvas.innerHTML += '<div class="flex row"></div>';
    for (let j = 0; j < n; j++)
      canvas.lastElementChild.innerHTML += '<div class="square' + (gridIsSelected ? ' grid' : '') + `" data-coordinate="${i};${j}"></div>`;
  }
}

function start() {
  createSquares();
  addCanvasEventListener(actionButtons.indexOf(document.querySelector('.selected')));
}

function main() {
  start();
  range.addEventListener('input', changeSizeInfo);
  range.addEventListener('change', createSquares);
  actionButtons.forEach((button, index) => button.addEventListener('click', () => addCanvasEventListener(index)));
  backgroundButton.addEventListener('change', changeBackgroundColor);
  gridButton.addEventListener('click', showGrid);
  clearButton.addEventListener('click', clearAll);
  colorButton.addEventListener('change', changeColor);
}

document.addEventListener('DOMContentLoaded', main);