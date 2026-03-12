class Paddle {
  constructor(W, H) {
    this.w = PAD_W; this.h = PAD_H;
    this.x = W/2 - this.w/2;
    this.y = H - 40;
    this.speed = PAD_SPEED;
    this.W = W;
    this.widePowerup = false;
    this.wideTimer = 0;
  }

  update(keys, targetX) {
    if (targetX !== null) {
      this.x += (targetX - this.w/2 - this.x) * 0.18;
    } else {
      if (keys['ArrowLeft'] || keys['KeyA']) this.x -= this.speed;
      if (keys['ArrowRight'] || keys['KeyD']) this.x += this.speed;
    }
    this.x = Math.max(0, Math.min(this.W - this.w, this.x));
    if (this.wideTimer > 0 && --this.wideTimer === 0) {
      this.w = PAD_W;
      this.widePowerup = false;
    }
  }

  applyWide() {
    this.w = PAD_W * 1.8;
    this.widePowerup = true;
    this.wideTimer = 400;
  }

  draw(ctx) {
    const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.h);
    grad.addColorStop(0, this.widePowerup ? '#ff0' : '#0ff');
    grad.addColorStop(1, this.widePowerup ? '#f80' : '#06a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.w, this.h, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}