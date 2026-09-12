(() => {
  const canvas = document.getElementById('universe');
  if (!canvas || canvas.dataset.initialized === 'true') return;

  canvas.dataset.initialized = 'true';
  const context = canvas.getContext('2d');
  const stars = [];
  const speed = 0.05;
  let width = 0;
  let height = 0;
  let starCount = 0;
  let initialBurst = true;

  const random = (min, max) => Math.random() * (max - min) + min;
  const chance = value => Math.floor(Math.random() * 1000) + 1 < 10 * value;

  class Star {
    reset() {
      this.giant = chance(3);
      this.comet = !this.giant && !initialBurst && chance(10);
      this.x = random(0, width - 10);
      this.y = random(0, height);
      this.radius = random(1.1, 2.6);
      this.dx = random(speed, 6 * speed) + (this.comet ? speed * random(50, 120) : 2 * speed);
      this.dy = -random(speed, 6 * speed) - (this.comet ? speed * random(50, 120) : 0);
      this.fadingOut = false;
      this.fadingIn = true;
      this.opacity = 0;
      this.opacityThreshold = random(0.2, 1 - 0.4 * Number(this.comet));
      this.opacityDelta = random(0.0005, 0.002) + (this.comet ? 0.001 : 0);
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;

      if (this.fadingIn) {
        this.opacity += this.opacityDelta;
        if (this.opacity > this.opacityThreshold) this.fadingIn = false;
      }

      if (this.x > width - width / 4 || this.y < 0) this.fadingOut = true;
      if (this.fadingOut) this.opacity -= this.opacityDelta / 2;
      if (this.opacity < 0 || this.x > width || this.y < 0) this.reset();
    }

    draw() {
      context.beginPath();
      if (this.giant) {
        context.fillStyle = `rgba(180,184,240,${this.opacity})`;
        context.arc(this.x, this.y, 2, 0, 2 * Math.PI);
      } else if (this.comet) {
        context.fillStyle = `rgba(226,225,224,${this.opacity})`;
        context.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
      } else {
        context.fillStyle = `rgba(226,225,142,${this.opacity})`;
        context.rect(this.x, this.y, this.radius, this.radius);
      }
      context.closePath();
      context.fill();
    }
  }

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    starCount = Math.floor(0.216 * width);
    canvas.width = width;
    canvas.height = height;

    while (stars.length < starCount) {
      const star = new Star();
      star.reset();
      stars.push(star);
    }
    if (stars.length > starCount) stars.length = starCount;
  };

  const render = () => {
    if (document.documentElement.dataset.theme === 'dark') {
      context.clearRect(0, 0, width, height);
      stars.forEach(star => {
        star.update();
        star.draw();
      });
    } else {
      context.clearRect(0, 0, width, height);
    }
    window.requestAnimationFrame(render);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.setTimeout(() => {
    initialBurst = false;
  }, 50);
  render();
})();
