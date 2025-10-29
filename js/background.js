/* === Floating lights background using canvas === */
const canvas = document.getElementById('bg-canvas');

function setupCanvas() {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.globalCompositeOperation = 'lighter';
  return ctx;
}

let ctx = setupCanvas();
window.addEventListener('resize', () => {
  ctx = setupCanvas();
  initLights();
});

let lights = [];
function rand(min, max) { return Math.random() * (max - min) + min; }

function initLights() {
  lights = [];
  const count = Math.floor(innerWidth / 60);
  for (let i = 0; i < count; i++) {
    lights.push({
      x: rand(0, innerWidth),
      y: rand(0, innerHeight),
      r: rand(10, 45),
      a: rand(0.08, 0.35),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.1, 0.1),
      hue: rand(0, 360),
      pulse: rand(0, Math.PI * 2)
    });
  }
}

function draw() {
  if (!ctx) return;

  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  for (const l of lights) {
    l.x += l.vx;
    l.y += l.vy;
    l.pulse += 0.02;

    // бесконечный поток
    if (l.x < -120) l.x = innerWidth + 120;
    if (l.x > innerWidth + 120) l.x = -120;
    if (l.y < -120) l.y = innerHeight + 120;
    if (l.y > innerHeight + 120) l.y = -120;

    const pulseScale = 1 + Math.sin(l.pulse) * 0.2;
    const alpha = l.a * (0.7 + Math.sin(l.pulse * 0.8) * 0.3);

    const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * pulseScale);
    g.addColorStop(0, `hsla(${l.hue}, 70%, 70%, ${alpha})`);
    g.addColorStop(0.3, `hsla(${l.hue}, 60%, 50%, ${alpha * 0.5})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.r * pulseScale, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

initLights();
draw();

/* === Logo glow on scroll & breathing === */
function logoGlowOnScroll() {
  const logos = document.querySelectorAll('.logo-wrap img');
  if (!logos.length) return;

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    logos.forEach(img => {
      if (s > 20) img.classList.add('logo-glow');
      else img.classList.remove('logo-glow');
    });
  });

  // эффект "дыхания" — лёгкое пульсирующее свечение
  setInterval(() => {
    logos.forEach(img => {
      img.style.filter = `drop-shadow(0 0 ${rand(3, 6)}px rgba(216,159,143,${rand(0.4, 0.7)}))`;
    });
  }, 1200);
}

logoGlowOnScroll();
