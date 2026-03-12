class Ball {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.r = BALL_R;
    this.vx = 0; this.vy = 0;
    this.speed = BALL_SPEED;
    this.stuck = true;
    this.active = true;
    this.trail = [];
  }

  launch() {
    const angle = -Math.PI/2 + (Math.random()-0.5) * Math.PI/4;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.stuck = false;
  }

  update(paddle, W, H) {
    if (this.stuck) {
      this.x = paddle.x + paddle.w / 2;
      this.y = paddle.y - this.r - 1;
      return;
    }
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();
    this.x += this.vx;
    this.y += this.vy;
    // walls
    if (this.x - this.r < 0) { this.x = this.r; this.vx = Math.abs(this.vx); }
    if (this.x + this.r > W) { this.x = W - this.r; this.vx = -Math.abs(this.vx); }
    if (this.y - this.r < 0) { this.y = this.r; this.vy = Math.abs(this.vy); }
    if (this.y > H + 20) this.active = false;
  }

  hitPaddle(paddle) {
    if (this.vy < 0) return false;
    if (this.x + this.r > paddle.x && this.x - this.r < paddle.x + paddle.w &&
        this.y + this.r > paddle.y && this.y - this.r < paddle.y + paddle.h) {
      const rel = (this.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
      const angle = rel * (Math.PI/3);
      const spd = Math.hypot(this.vx, this.vy);
      this.vx = Math.sin(angle) * spd;
      this.vy = -Math.abs(Math.cos(angle) * spd);
      this.y = paddle.y - this.r - 1;
      return true;
    }
    return false;
  }

  draw(ctx) {
    // trail
    this.trail.forEach((t, i) => {
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.r * (i/this.trail.length) * 0.7, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,255,255,${i/this.trail.length*0.3})`;
      ctx.fill();
    });
    // ball
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}