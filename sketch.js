const canvas = document.getElementById('cnv');
const c = canvas.getContext('2d');

let width  = canvas.width  = innerWidth;
let height = canvas.height = innerHeight;

let rad;

const circle = false;

window.onload = () => {
  width  = canvas.width  = innerWidth;
  height = canvas.height = innerHeight;
  rad = (width<height?width:height)*0.45;

  c.fillStyle = '#000004';
  c.fillRect(0, 0, width, height);
  c.strokeStyle = '#fff';
  c.shadowColor = '#ffd8';
  c.shadowBlur = 100/2;
  draw();
}

let history = [];
for (let y = 0; y < height; y++) {
  history[y] = [];
  for (let x = 0; x < width; x++) {
    history[y][x] = false;
  }
}

function posOrNeg(n = 1) {
  if (Math.random() < 0.5) {
    return n;
  } else {
    return -n;
  }
}

function particle(x, y, dir, arr) {
  this.x = x;
  this.y = y;
  this.startx = x;
  this.starty = y;
  this.dx = 0;
  this.dy = 0;

  this.dir = dir;
  switch (this.dir) {
    case 0:
      this.dy = -1;
      break;
    case 1:
      this.dy = -1;
      this.dx = +1;
      break;
    case 2:
      this.dx = +1;
      break;
    case 3:
      this.dx = +1;
      this.dy = +1;
      break;
    case 4:
      this.dy = +1;
      break;
    case 5:
      this.dy = +1;
      this.dx = -1;
      break;
    case 6:
      this.dx = -1;
      break;
    case 7:
      this.dx = -1;
      this.dy = -1;
      break;
    default:
      this.isAlive = false;
      break;
  }

  this.parentArray = arr;
  this.isAlive = true;
  this.age = 0;

  this.update = function() {

    if (this.isAlive) {
      if (this.age > 1 && Math.random() < 1/40) {
        this.isAlive = false;
        let n = Math.random()>0.01?2:1;
        this.parentArray.push(new particle(this.x, this.y, (this.dir + n + 8) % 8, this.parentArray));
        this.parentArray.push(new particle(this.x, this.y, (this.dir - n + 8) % 8, this.parentArray));
        return;
      }

      this.age++;

      this.x += this.dx;
      this.y += this.dy;

      if (this.x < 0 || this.x >= width || this.y < 0 || this.y >= height || history[this.y][this.x] || (circle && Math.hypot(width/2 - this.x, height/2 - this.y) >= rad)) {
        this.isAlive = false;
        return;
      } else if ((this.dx != 0 && this.dy != 0) && (this.x + this.dx >= 0 && this.x + this.dx < width && this.y + this.dy >= 0 && this.y + this.dy < height) && (history[this.y][this.x+this.dx] && history[this.y+this.dy][this.x])) {
        this.isAlive = false;
        return;
      }

      history[this.y][this.x] = true;
    }
  }

}


let particles = [];
let dir = Math.random()*2|0, pos = [Math.random()*(width-1)|0+1, Math.random()*(height-1)|0+1];
particles.push(new particle(pos[0], pos[1], dir?0:2, particles));
particles.push(new particle(pos[0], pos[1], dir?4:6, particles));

function draw() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    if (!p.isAlive) {
      particles.splice(i, 1);
      c.beginPath();
      c.moveTo(p.startx - 0.5, p.starty - 0.5);
      c.lineTo(p.x - 0.5, p.y - 0.5);
      c.stroke();
    }
  }

  if (particles.length) requestAnimationFrame(draw);
}
