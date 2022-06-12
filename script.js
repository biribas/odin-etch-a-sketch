const canvas = document.getElementById('canvas');

function createSquares(n) {
  for (let i = 0; i < n; i++) {
    canvas.innerHTML += '<div class="flex row"></div>';
    for (let j = 0; j < n; j++)
      canvas.lastElementChild.innerHTML += '<div class="square"></div>';
  }
}