class Brick {
  constructor(x, y, col, row, level) {
    this.x = x; this.y = y;
    this.w = BRICK_W - BRICK_PAD;
    this.h = BRICK_H - BRICK_PAD;
    this.col = col; this.row = row;
    this.maxHp = Math.min(row + 1 + Math.floor(level / 3), 4);
    this.hp = this.maxHp;
    this.active = true;
    this.flashTimer = 0;
  }

  get color() { return BRICK_COLORS[Math.min(this.row, BRICK_COLORS.length - 1)]; }

  hit() {
    this.hp--;
    this.flashTimer = 5;
    if (this.hp <= 0) { this.active = false; return true; }
    return false;
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    if (this.flashTimer > 0) { ctx.globalAlpha = 0.5; this.flashTimer--; }
    const alpha = 0.5 + 0.5 * (this.hp / this.maxHp);
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.w, this.h, 3);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // hp dots
    if (this.maxHp > 1) {
      for (let i = 0; i < this.hp; i++) {
        ctx.beginPath();
        ctx.arc(this.x + 6 + i * 8, this.y + this.h - 5, 2, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

function buildBricks(level) {
  const bricks = [];
  const startY = 50;
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      const x = 20 + c * BRICK_W;
      const y = startY + r * BRICK_H;
      bricks.push(new Brick(x, y, c, r, level));
    }
  }
  return bricks;
}