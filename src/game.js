class BreakoutGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CW; canvas.height = CH;
    this.state = 'idle';
    this.score = 0; this.level = 1; this.lives = 3;
    this.best = parseInt(localStorage.getItem('breakout-best')||'0');
    this.keys = {}; this.mouseX = null;
    this.paddle = new Paddle(CW, CH);
    this.balls = [new Ball(CW/2, CH-60)];
    this.bricks = buildBricks(1);
    this.powerups = [];
    this.animId = null; this.lastTime = 0;
    this.combo = 0; this.comboTimer = 0;
  }

  start() {
    this.state = 'playing';
    this.score = 0; this.level = 1; this.lives = 3;
    this.paddle = new Paddle(CW, CH);
    this.balls = [new Ball(CW/2, CH-60)];
    this.bricks = buildBricks(1);
    this.powerups = [];
    this.combo = 0;
    document.getElementById('overlay').classList.remove('show');
    this.updateHUD();
    if (this.animId) cancelAnimationFrame(this.animId);
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop(t) {
    this.lastTime = t;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(ts => this.loop(ts));
  }

  update() {
    if (this.state !== 'playing') return;
    this.paddle.update(this.keys, this.mouseX);
    if (this.comboTimer > 0) this.comboTimer--;
    else this.combo = 0;

    this.balls.forEach(ball => {
      ball.update(this.paddle, CW, CH);
      ball.hitPaddle(this.paddle);
      this.checkBallBricks(ball);
    });

    this.balls = this.balls.filter(b => b.active);
    if (this.balls.length === 0) {
      this.lives--;
      if (this.lives <= 0) { this.endGame(); return; }
      this.balls = [new Ball(CW/2, CH-60)];
    }

    this.powerups.forEach(p => p.update());
    this.powerups = this.powerups.filter(p => {
      if (!p.offScreen(CH) && this.hitPaddle(p)) { this.applyPowerup(p); return false; }
      return !p.offScreen(CH);
    });

    if (this.bricks.every(b => !b.active)) {
      this.level++;
      this.bricks = buildBricks(this.level);
      this.balls = [new Ball(CW/2, CH-60)];
    }
    this.updateHUD();
  }

  checkBallBricks(ball) {
    this.bricks.forEach(brick => {
      if (!brick.active) return;
      const bx = ball.x, by = ball.y, r = ball.r;
      if (bx+r<brick.x||bx-r>brick.x+brick.w||by+r<brick.y||by-r>brick.y+brick.h) return;
      const overlapX = Math.min(bx+r-brick.x, brick.x+brick.w-bx+r);
      const overlapY = Math.min(by+r-brick.y, brick.y+brick.h-by+r);
      if (overlapX < overlapY) ball.vx *= -1; else ball.vy *= -1;
      if (brick.hit()) {
        this.combo++; this.comboTimer = 60;
        this.score += 10 * this.level * Math.max(1, this.combo);
        if (Math.random() < POWERUP_CHANCE) this.powerups.push(new PowerUp(brick.x+brick.w/2, brick.y));
      }
    });
  }

  hitPaddle(obj) {
    return obj.x+obj.w > this.paddle.x && obj.x < this.paddle.x+this.paddle.w &&
           obj.y+obj.h > this.paddle.y && obj.y < this.paddle.y+this.paddle.h;
  }

  applyPowerup(p) {
    if (p.id==='wide') this.paddle.applyWide();
    if (p.id==='life') { this.lives++; }
    if (p.id==='slow') this.balls.forEach(b => { b.vx*=0.7; b.vy*=0.7; });
    if (p.id==='multiball') {
      const orig = this.balls[0];
      if (orig) {
        const b2 = new Ball(orig.x, orig.y);
        b2.vx = -orig.vx; b2.vy = orig.vy; b2.stuck = false;
        this.balls.push(b2);
      }
    }
  }

  updateHUD() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('level').textContent = this.level;
    document.getElementById('lives').textContent = this.lives;
    document.getElementById('best').textContent = this.best;
  }

  endGame() {
    this.state = 'gameover';
    if (this.score > this.best) { this.best = this.score; localStorage.setItem('breakout-best', this.best); }
    document.getElementById('msg').textContent = `Score: ${this.score} | Best: ${this.best} — Tap to replay`;
    document.getElementById('overlay').classList.add('show');
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0,0,CW,CH);
    this.bricks.forEach(b => b.draw(ctx));
    this.powerups.forEach(p => p.draw(ctx));
    this.balls.forEach(b => b.draw(ctx));
    this.paddle.draw(ctx);
    if (this.combo > 1) {
      ctx.fillStyle = '#ff0';
      ctx.font = 'bold 14px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText(`x${this.combo} COMBO!`, 8, CH-8);
    }
  }
}