/* === Garem House — Ambient Lights Background === */
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
  const count = Math.floor(innerWidth / 80);
  for (let i = 0; i < count; i++) {
    lights.push({
      x: rand(0, innerWidth),
      y: rand(0, innerHeight),
      r: rand(15, 60),
      baseR: 0,
      a: rand(0.03, 0.15),
      vx: rand(-0.05, 0.05),
      vy: rand(-0.03, 0.03),
      hue: rand(5, 20), // Тёплый золотисто-бордовый диапазон
      pulse: rand(0, Math.PI * 2)
    });
  }
}

function draw() {
  if (!ctx) return;

  // лёгкое затемнение без следов
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  for (const l of lights) {
    l.x += l.vx;
    l.y += l.vy;
    l.pulse += 0.01;

    if (l.x < -80) l.x = innerWidth + 80;
    if (l.x > innerWidth + 80) l.x = -80;
    if (l.y < -80) l.y = innerHeight + 80;
    if (l.y > innerHeight + 80) l.y = -80;

    const pulseScale = 1 + Math.sin(l.pulse) * 0.05;
    const alpha = l.a * (0.8 + Math.sin(l.pulse * 0.5) * 0.2);

    const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * pulseScale);
    g.addColorStop(0, `hsla(${l.hue}, 60%, 70%, ${alpha})`);
    g.addColorStop(0.3, `hsla(${l.hue}, 70%, 55%, ${alpha * 0.3})`);
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

/* === Logo glow on scroll + subtle breathing === */
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

  // мягкое дыхание — еле заметное свечение
  setInterval(() => {
    logos.forEach(img => {
      img.style.filter = `drop-shadow(0 0 ${rand(2, 4)}px rgba(216,159,143,${rand(0.25, 0.45)}))`;
    });
  }, 1500);
}

logoGlowOnScroll();
