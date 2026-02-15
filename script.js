const puzzle = document.getElementById('puzzle');
const shuffleBtn = document.getElementById('shuffle');
const movesDisplay = document.getElementById('moves');

let tiles = [];
let emptyPos = { row: 3, col: 3 }; // начальное положение пустой ячейки
let moveCount = 0;

// Создаём плитки
function createTiles() {
  const numbers = Array.from({ length: 15 }, (_, i) => i + 1);
  tiles = numbers.map(num => ({
    value: num,
    row: Math.floor((num - 1) / 4),
    col: (num - 1) % 4
  }));
  tiles.push({ value: null, row: 3, col: 3 }); // пустая ячейка
}

// Отрисовываем поле
function renderPuzzle() {
  puzzle.innerHTML = '';
  tiles.forEach(tile => {
    const div = document.createElement('div');
    div.className = 'tile';
    if (tile.value === null) {
      div.classList.add('empty');
    } else {
      div.textContent = tile.value;
    }
    puzzle.appendChild(div);
  });
}

// Перемешиваем плитки (простой алгоритм)
function shuffle() {
  moveCount = 0;
  movesDisplay.textContent = `Ходы: ${moveCount}`;

  // 100 случайных ходов
  for (let i = 0; i < 100; i++) {
    const possibleMoves = getPossibleMoves();
    if (possibleMoves.length > 0) {
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      moveTile(randomMove.row, randomMove.col);
    }
  }
}

// Получаем возможные ходы (соседние с пустой ячейкой)
function getPossibleMoves() {
  const moves = [];
  const { row, col } = emptyPos;

  // вверх
  if (row > 0) moves.push({ row: row - 1, col });
  // вниз
  if (row < 3) moves.push({ row: row + 1, col });
  // влево
  if (col > 0) moves.push({ row, col: col - 1 });
  // вправо
  if (col < 3) moves.push({ row, col: col + 1 });

  return moves;
}

// Перемещение плитки
function moveTile(targetRow, targetCol) {
  const targetIndex = targetRow * 4 + targetCol;
  const emptyIndex = emptyPos.row * 4 + emptyPos.col;

  // Меняем местами
  [tiles[targetIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[targetIndex]];

  // Обновляем позиции
  tiles[targetIndex].row = targetRow;
  tiles[targetIndex].col = targetCol;
  emptyPos = { row: targetRow, col: targetCol };

  moveCount++;
  movesDisplay.textContent = `Ходы: ${moveCount}`;

  renderPuzzle();
}

// Проверка победы
function checkWin() {
  for (let i = 0; i < 15; i++) {
    const tile = tiles[i];
    if (tile.value !== i + 1) return false;
  }
  return true;
}

// Обработчик кликов
puzzle.addEventListener('click', (e) => {
  if (e.target.classList.contains('tile') && !e.target.classList.contains('empty')) {
    const index = Array.from(puzzle.children).indexOf(e.target);
    const row = Math.floor(index / 4);
    const col = index % 4;

    // Проверяем, можно ли переместить
    const possibleMoves = getPossibleMoves();
    const canMove = possibleMoves.some(move => move.row === row && move.col === col);

    if (canMove) {
      moveTile(row, col);
      if (checkWin()) {
        alert(`Победа! Вы собрали пазл за ${moveCount} ходов.`);
      }
    }
  }
});

// Инициализация
createTiles();
renderPuzzle();
shuffle(); // сразу перемешиваем при загрузке

// Кнопка перемешивания
shuffleBtn.addEventListener('click', shuffle);
