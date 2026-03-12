window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const game = new BreakoutGame(canvas);

  document.addEventListener('keydown', e => {
    game.keys[e.code] = true;
    if (e.code==='Space') { e.preventDefault(); if (game.state!=='playing') game.start(); }
  });
  document.addEventListener('keyup', e => { game.keys[e.code] = false; });
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    game.mouseX = e.clientX - r.left;
  });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    game.mouseX = e.touches[0].clientX - r.left;
  }, {passive:false});
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (game.state!=='playing') game.start();
  }, {passive:false});
  document.getElementById('overlay').addEventListener('click', () => game.start());
  game.draw();
});