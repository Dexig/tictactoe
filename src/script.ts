// Говнокод написанный на скорую руку в целях демонстрации работы алгоритмы минимакс.!!!!

function drawAction(index, player) {
  const template = {
    x: `
    <svg class="ico ico-x" viewBox="0 0 128 128" style="visibility: visible;">
      <path d="M16,16L112,112"></path>
      <path d="M112,16L16,112"></path>
    </svg>
    `,
    o: `
    <svg class="ico ico-o" viewBox="0 0 128 128" style="visibility: visible;">
      <path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16"></path>
    </svg>
    `
  };

  document.querySelector(`[data-cell="${index}"]`).innerHTML = template[player];
}

function clearTable(cells: NodeListOf<Element>, game: Krestik, start: Element, status) {
  if (game) {
    game.clear();
  }
  if (start) {
    start.removeAttribute('disabled');
  }
  if (status) {
    status.state = true;
  }
  for (let cell of cells) {
    cell.innerHTML = '';
  }
}

function init() {
  const inputPlayer = document.querySelector('[data-control="player"]');
  const table = document.querySelector('[data-table]');
  const cells = document.querySelectorAll('[data-cell]');
  const start = document.querySelector('[data-control="start"]');
  const header = document.querySelector('[data-header]');

  let krestik: Krestik;
  let player: string;
  let pending = false;
  let status;

  inputPlayer.addEventListener('click', (e: any) => {
    const input = e.target;
    const pl = e.target.dataset.player;
    if (pl && input.checked) {
      player = pl;
      clearTable(cells, krestik, start, status);
    }
  });

  start.addEventListener('click', (e) => {
    pending = true;
    clearTable(cells, krestik, start, status);

    if (player) {
      krestik = new Krestik(player);
      status = krestik.start();

      header.innerHTML = 'Tic Tac Toe';
      start.setAttribute('disabled', 'disabled');

      if (status.player) {
        drawAction(status.lastMove, status.player);
      }
    }
    pending = false;
  });

  table.addEventListener('click', (e: any) => {
    if (pending || !status) return;
    pending = true;

    const cell = e.target.dataset.cell;

    if (status.state === true || status.draw === true) {
      return;
    }

    if (cell) {
      if (Boolean(e.target.innerHTML)) return;

      const botPlayer = player === 'x' ? 'o' : 'x';
      drawAction(cell, player);
      status = krestik.userAction(cell);

      if (status.player === player && status.state) {
        header.innerHTML += ' - ПОБЕДА!'
        start.removeAttribute('disabled');
      } else if (status.player !== player && status.state) {
        header.innerHTML += ' - ПОРАЖЕНИЕ!'
        start.removeAttribute('disabled');
      } else if (status.draw) {
        header.innerHTML += ' - НИЧЬЯ!'
        start.removeAttribute('disabled');
      }
      drawAction(status.lastMove, status.player);
    }
    pending = false;
  });
}

init();
