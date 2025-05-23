let countdownDiv;
let firework = [];
let force;
let timerEnded = false;

function getTargetDate() {
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 45, 0); // 10:35 PM today
}

let targetDate = getTargetDate();

function setup() {
  createCanvas(windowWidth, windowHeight);
  force = createVector(0, 0.2);
  countdownDiv = select('#timer');
  frameRate(30);
}

function draw() {
  background(0, 25);

  if (!timerEnded) {
    let now = new Date();

    if (now >= targetDate) {
      timerEnded = true;
      countdownDiv.hide();
    } else {
      let diff = targetDate - now;
      let hours = nf(floor((diff / (1000 * 60 * 60)) % 24), 2);
      let minutes = nf(floor((diff / (1000 * 60)) % 60), 2);
      let seconds = nf(floor((diff / 1000) % 60), 2);

      countdownDiv.html(`Countdown to birthday:<br>${hours}:${minutes}:${seconds}`);
      return;
    }
  }

  // Fireworks animation after countdown ends
  if (frameCount % 20 === 0) {
    firework.push(new fireworks());
  }

  for (let i = firework.length - 1; i >= 0; i--) {
    firework[i].update();
    firework[i].show();

    if (firework[i].particles.length === 0 && firework[i].explode) {
      firework.splice(i, 1);
    }
  }

  textSize(30);
  textAlign(CENTER);
  fill(255);
  text("Happy Birthday\nBirthday name🥰 Stay happy forever", width / 2, height / 2);
}

function mouseClicked() {
  let f = new fireworks();
  f.firework = new particle(mouseX, mouseY, random(255), true);
  firework.push(f);
}

function particle(x, y, col, firework) {
  this.opacity = 255;
  this.pos = createVector(x, y);
  this.col = col;

  if (firework) {
    this.vel = createVector(0, random(-10, -2));
  } else {
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 6));
  }

  this.acc = createVector(0, -4);

  this.show = function () {
    if (!firework) {
      strokeWeight(2);
      stroke(this.col, 255, 255, this.opacity);
    } else {
      strokeWeight(4);
      stroke(this.col, 255, 255);
    }
    point(this.pos.x, this.pos.y);
  }

  this.applyForce = function (force) {
    this.acc.add(force);
  }

  this.update = function () {
    if (!firework) {
      this.vel.mult(0.99);
      this.opacity -= 7;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}

function fireworks() {
  this.firework = new particle(random(width), height - 10, random(255), true);
  this.explode = false;
  this.particles = [];

  this.update = function () {
    if (!this.explode) {
      this.firework.applyForce(force);
      this.firework.show();
      if (this.firework.vel.y >= 0) {
        this.explode = true;
        this.explore();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].applyForce(force);

      if (this.particles[i].opacity <= 1) {
        this.particles.splice(i, 1);
      }
    }
  }

  this.show = function () {
    colorMode(HSB);
    if (!this.explode) {
      this.firework.update();
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }

  this.explore = function () {
    for (let i = 0; i < 150; i++) {
      this.particles.push(new particle(this.firework.pos.x, this.firework.pos.y, random(255), false));
    }
  }
}
