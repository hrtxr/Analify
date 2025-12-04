/* ========== Gestion de la voiture animée ========== */

export class Car {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', {alpha: true});
    this.carImg = null;
    this.posX = 0;
    this.posY = 0;
    this.yVel = 0;
    this.visualScale = 1.0;
    this.lastPeakTime = 0;
    this.jumpSensitivity = 0.18;
  }

  loadImage(file) {
    const img = new Image();
    img.onload = () => { this.carImg = img; };
    img.src = URL.createObjectURL(file);
  }

  setJumpSensitivity(value) {
    this.jumpSensitivity = value;
  }

  update(progress, amplitude, groundY, canvasWidth, canvasHeight) {
    this.posX = progress * canvasWidth;
    
    // Jump detection
    const now = performance.now();
    if (amplitude > this.jumpSensitivity && (now - this.lastPeakTime) > 180) {
      this.yVel = -6 - (amplitude * 12);
      this.lastPeakTime = now;
    }

    // Gravity simulation
    this.yVel += 0.35;
    this.posY += this.yVel;
    
    const carGround = groundY - 12;
    
    if (this.posY > carGround) {
      this.posY = carGround;
      this.yVel *= -0.12;
      if (Math.abs(this.yVel) < 0.5) this.yVel = 0;
    }

    // Initialize posY if first frame
    if (!this.posY || this.posY === 0) this.posY = carGround;
  }

  draw(groundY, canvasWidth, canvasHeight) {
    const W = canvasWidth;
    const H = canvasHeight;

    // Draw shadow
    const shadowW = 60 * this.visualScale;
    const shadowH = 12 * this.visualScale;
    this.ctx.beginPath();
    this.ctx.ellipse(this.posX, groundY + 22, shadowW, shadowH, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(0,0,0,0.28)";
    this.ctx.fill();

    // Draw car
    if (this.carImg) {
      const cw = 120 * this.visualScale;
      const ch = (this.carImg.height / this.carImg.width) * cw;
      this.ctx.save();
      const tilt = Math.max(-0.25, Math.min(0.25, this.yVel * 0.03));
      this.ctx.translate(this.posX, this.posY - ch / 2);
      this.ctx.rotate(tilt);
      this.ctx.drawImage(this.carImg, -cw / 2, -ch / 2, cw, ch);
      this.ctx.restore();
    } else {
      this.drawStylizedCar(W);
    }
  }

  drawStylizedCar(canvasWidth) {
    this.ctx.save();
    this.ctx.translate(this.posX, this.posY);
    const scale = Math.max(0.6, Math.min(1.2, canvasWidth / 900));
    this.ctx.scale(scale, scale);
    
    // Body
    this.ctx.beginPath();
    this.roundRect(this.ctx, -48, -18, 96, 36, 8);
    const lg = this.ctx.createLinearGradient(-48, -18, 48, 18);
    lg.addColorStop(0, "#ffdd57");
    lg.addColorStop(1, "#ff6b6b");
    this.ctx.fillStyle = lg;
    this.ctx.fill();
    
    // Cabin
    this.ctx.beginPath();
    this.roundRect(this.ctx, -8, -28, 36, 20, 6);
    this.ctx.fillStyle = "rgba(255,255,255,0.92)";
    this.ctx.fill();
    
    // Wheels
    this.ctx.beginPath();
    this.ctx.fillStyle = "#111";
    this.ctx.arc(-28, 22, 10, 0, Math.PI * 2);
    this.ctx.arc(28, 22, 10, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  roundRect(ctx, x, y, w, h, r) {
    if (typeof r === 'number') r = {tl: r, tr: r, br: r, bl: r};
    else r = Object.assign({tl: 0, tr: 0, br: 0, bl: 0}, r);
    
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
  }
}

// Polyfill for roundRect
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = {tl: r, tr: r, br: r, bl: r};
    else r = Object.assign({tl: 0, tr: 0, br: 0, bl: 0}, r);
    
    this.beginPath();
    this.moveTo(x + r.tl, y);
    this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x + r.tl, y);
    this.closePath();
  };
}
