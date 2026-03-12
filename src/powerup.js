const PU_TYPES = [
  { id: 'wide',      color: '#ff0', label: 'W', desc: 'Wide Paddle' },
  { id: 'multiball', color: '#f0f', label: 'M', desc: 'Multi-Ball' },
  { id: 'slow',      color: '#0ff', label: 'S', desc: 'Slow Ball' },
  { id: 'life',      color: '#0f0', label: '+', desc: 'Extra Life' }
];

class PowerUp {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 24; this.h = 16;
    const t = PU_TYPES[Math.floor(Math.random() * PU_TYPES.length)];
    this.id = t.id;
    this.color = t.color;
    this.label = t.label;
    this.vy = 2.5;
    this.active = true;
    this.angle = 0;
  }

  update() { this.y += this.vy; this.angle += 0.06; }
  offScreen(H) { return this.y > H + 20; }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.w/2, this.y + this.h/2);
    ctx.rotate(Math.sin(this.angle) * 0.15);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(-this.w/2, -this.h/2, this.w, this.h, 4);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.shadowBlur = 0;
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, 0, 0);
    ctx.restore();
  }
}