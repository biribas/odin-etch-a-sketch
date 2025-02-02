let canvas = document.getElementById('canvas');
const range = document.querySelector('input[type="range"]');
const size = document.getElementById('size');

const menu = document.querySelectorAll('.button');

const actionButtons = [...menu].slice(0, 7);
const actionFunctions = actionButtons.map(e => window[e.parentElement.id]);

const colorIcon = menu[7];
const colorButton = document.querySelector('#color > input');
const backgroundIcon = menu[8];
const backgroundButton = document.querySelector('#background > input');
const gridButton = menu[9];
const clearButton = menu[10];

const undoButton = document.querySelector('#undo');
const redoButton = document.querySelector('#redo');
const downloadButton = document.querySelector('#download');

const info = {
  mousedown: false,
  currentColor: colorButton.value,
  currentBackgroundColor: backgroundButton.value,
  currentSize: 0,
  canvasHistory: {
    record: [],
    currentIndex: -1,
    max: 1000
  }
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
      const backgroundColor = getComputedStyle(e.target).getPropertyValue('background-color');
      actionFunction(+coordinate[0], +coordinate[1], backgroundColor);
      return saveNewCanvas();
    });

  if (id === 'eyedropper') {
    return canvas.addEventListener('mousedown', e => actionFunction(e.target));
  }

  canvas.addEventListener('mousedown', e => (info.mousedown = true, actionFunction(e.target)));
  canvas.addEventListener('mouseover', e => info.mousedown && actionFunction(e.target));
  canvas.addEventListener('mouseup', () => (info.mousedown = false, saveNewCanvas()));
}

function brush(target) {
  target.style.backgroundColor = info.currentColor;
  target.removeAttribute('data-brightness');
  target.classList.add('scratched');
}

function bucket(i, j, oldColor) {
  if (i < 0 || i >= info.currentSize || j < 0 || j >= info.currentSize) return;

  const square = canvas.querySelector(`[data-coordinate="${i};${j}"]`);
  const squareColor = getComputedStyle(square).getPropertyValue('background-color');

  if (squareColor !== oldColor) return;

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
  info.currentBackgroundColor = backgroundButton.value;
  backgroundIcon.style.color = backgroundButton.value;

  canvas.querySelectorAll('.square').forEach(square => {
    const isScratched = square.classList.contains('scratched');
    const isShadedOrLightened = square.hasAttribute('data-brightness') && square.dataset.brightness !== '0';

    if (!isScratched && isShadedOrLightened) {
      const brightnessLevel = +square.dataset.brightness * 15;
      const rgbArray = hexToRGBArray(info.currentBackgroundColor).map(e => (e + brightnessLevel) < 0 ? 0 : e + brightnessLevel);
      square.style.backgroundColor = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
    }
    else if (!isScratched)
      square.style.backgroundColor = info.currentBackgroundColor;
  });
}

function showGrid() {
  if (canvas.classList.contains('grid')) {
    gridButton.classList.remove('selected');    
    canvas.classList.remove('grid');
    return;
  }
  
  gridButton.classList.add('selected');
  canvas.classList.add('grid');
}

function clearAll() {
  canvas.querySelectorAll('.square').forEach(square => {
    square.classList.remove('scratched');
    square.removeAttribute('data-brightness');
    square.style.backgroundColor = info.currentBackgroundColor;
  });
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
  
  canvas.innerHTML = '';
  for (let i = 0; i < n; i++) {
    canvas.innerHTML += '<div class="flex row"></div>';
    for (let j = 0; j < n; j++)
      canvas.lastElementChild.innerHTML += `<div class="square" data-coordinate="${i};${j}"></div>`;
  }
}

function controlUndoRedoVisibility() {
  const currentIndex = info.canvasHistory.currentIndex;
  const isUndoClickable = currentIndex > 0;
  const isRedoClickable = info.canvasHistory.record[currentIndex + 1] !== undefined;

  isUndoClickable ? undoButton.classList.add('clickable') : undoButton.classList.remove('clickable');
  isRedoClickable ? redoButton.classList.add('clickable') : redoButton.classList.remove('clickable');
}

function saveNewCanvas() {
  const currentIndex = info.canvasHistory.currentIndex;
  const nextIndex = currentIndex + 1;
  info.canvasHistory.record = info.canvasHistory.record.slice(0, nextIndex);

  const element = {
    canvas: canvas.cloneNode(true),
    size: info.currentSize,
    backgroundColor: info.currentBackgroundColor
  };

  info.canvasHistory.record.push(element);
  
  if (nextIndex === info.canvasHistory.max)
    return info.canvasHistory.record.shift();

  info.canvasHistory.currentIndex = nextIndex;

  controlUndoRedoVisibility();
}

function undo_redo(target) {
  const sign = target.id === 'undo' ? -1 : 1
  const nextIndex = info.canvasHistory.currentIndex + sign;
  
  if (info.canvasHistory.record[nextIndex] === undefined) return;
  
  const nextCanvas = info.canvasHistory.record[nextIndex];

  info.currentSize = nextCanvas.size;
  range.value = nextCanvas.size;
  changeSizeInfo();

  info.currentBackgroundColor = nextCanvas.backgroundColor;
  backgroundIcon.style.color = nextCanvas.backgroundColor;
  backgroundButton.value = nextCanvas.backgroundColor;

  canvas.innerHTML = nextCanvas.canvas.innerHTML;
  info.canvasHistory.currentIndex = nextIndex;
  
  controlUndoRedoVisibility();
}

function handleDownload() {
  const downloadCanvas = document.createElement('canvas');
  downloadCanvas.width = downloadCanvas.height = info.currentSize;

  const context = downloadCanvas.getContext('2d');
  for (let i = 0; i < info.currentSize; i++) {
    for (let j = 0; j < info.currentSize; j++) {
      const pixel = context.createImageData(1, 1);
      const div = canvas.querySelector(`[data-coordinate="${i};${j}"]`);
      const colors = toRGBArray(getComputedStyle(div).getPropertyValue('background-color'));
      for (let c = 0; c < 3; c++)
        pixel.data[c] = colors[c];
      pixel.data[3] = 255;
      context.putImageData(pixel, i, j);
    }
  }

  const link = document.createElement('a');
  link.download = 'canvas.png';
  link.href = downloadCanvas.toDataURL();
  link.click();
}

function start() {
  createSquares();
  saveNewCanvas();
  addCanvasEventListener(actionButtons.indexOf(document.querySelector('.selected')));
}

function main() {
  start();
  document.addEventListener('mouseup', () => (info.mousedown && saveNewCanvas(), info.mousedown = false));
  range.addEventListener('input', changeSizeInfo);
  range.addEventListener('change', () => (createSquares(), saveNewCanvas()));

  actionButtons.forEach((button, index) => button.addEventListener('click', () => addCanvasEventListener(index)));
  backgroundButton.addEventListener('change', () => (changeBackgroundColor(), saveNewCanvas()));
  gridButton.addEventListener('click', showGrid);
  clearButton.addEventListener('click', () => (clearAll(), saveNewCanvas()));
  colorButton.addEventListener('change', changeColor);

  undoButton.addEventListener('click', e => undo_redo(e.target));
  redoButton.addEventListener('click', e => undo_redo(e.target));
  downloadButton.addEventListener('click', handleDownload);

  document.addEventListener('keydown', e => {
    if (e.key !== 'z' && e.key !== 'Z') return;
    if (e.ctrlKey && e.shiftKey) return undo_redo(redoButton);
    if (e.ctrlKey) return undo_redo(undoButton);
  });
}

document.addEventListener('DOMContentLoaded', main);