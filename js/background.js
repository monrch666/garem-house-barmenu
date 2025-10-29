/* Floating lights background using canvas */
const canvas = document.getElementById('bg-canvas');
function setupCanvas(){
  if(!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  return ctx;
}
let ctx = setupCanvas();
window.addEventListener('resize', ()=>{ ctx = setupCanvas(); initLights(); });

let lights = [];
function rand(min,max){ return Math.random()*(max-min)+min; }
function initLights(){
  lights = [];
  for(let i=0;i<22;i++){
    lights.push({
      x: rand(0, innerWidth),
      y: rand(0, innerHeight),
      r: rand(8,40),
      a: rand(0.02,0.35),
      vx: rand(-0.2,0.2),
      vy: rand(-0.1,0.1),
      hue: rand(330,10)
    });
  }
}
function draw(){
  if(!ctx) return;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const l of lights){
    l.x += l.vx;
    l.y += l.vy;
    if(l.x<-100) l.x = innerWidth+100;
    if(l.x>innerWidth+100) l.x = -100;
    if(l.y<-100) l.y = innerHeight+100;
    if(l.y>innerHeight+100) l.y = -100;

    const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
    g.addColorStop(0, `rgba(216,159,143,${l.a})`);
    g.addColorStop(0.4, `rgba(216,159,143,${l.a*0.4})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.r, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
initLights();
draw();

/* logo glow on scroll */
function logoGlowOnScroll(){
  const logos = document.querySelectorAll('.logo-wrap img');
  if(!logos) return;
  window.addEventListener('scroll', ()=>{
    const s = window.scrollY;
    logos.forEach(img=>{
      if(s>20) img.classList.add('logo-glow'); else img.classList.remove('logo-glow');
    });
  });
}
logoGlowOnScroll();
