document.addEventListener('DOMContentLoaded', ()=>{
  let staffData = null;
  try { staffData = JSON.parse(localStorage.getItem('garem_staff')); } catch(e){ staffData = null; }
  if(!staffData) {
    // try fetch
    fetch('./data/staff.json?nocache=' + Date.now()).then(r=>r.json()).then(j=>{ staffData = j; localStorage.setItem('garem_staff', JSON.stringify(j)); render(); }).catch(()=>{
      staffData = [{"name":"Лейла","role":"Главная звезда","photo":"images/staff1.jpg"}];
      render();
    });
  } else render();

  function render(){
    const staffSwiper = document.getElementById('staff-swiper');
    const staffGrid = document.getElementById('staff-grid');
    staffGrid.innerHTML='';
    staffSwiper.innerHTML='';
    const top = (staffData || []).slice(0,6).reverse();
    (staffData || []).forEach(s=>{
      const t = document.createElement('div');
      t.className='staff-thumb card';
      t.innerHTML = `<img src="${s.photo || 'images/staff-placeholder.png'}" alt="${s.name}"><div style="padding:8px"><strong>${escapeHtml(s.name)}</strong><div class="muted">${escapeHtml(s.role)}</div></div>`;
      staffGrid.appendChild(t);
    });
    top.forEach((s, idx)=>{
      const c = document.createElement('div');
      c.className='staff-card card';
      c.style.zIndex = 100 + idx;
      c.innerHTML = `<img src="${s.photo || 'images/staff-placeholder.png'}" alt="${s.name}"><div class="meta"><strong>${escapeHtml(s.name)}</strong><div class="muted">${escapeHtml(s.role)}</div></div>`;
      staffSwiper.appendChild(c);
      makeSwipeable(c);
    });
  }

  function makeSwipeable(card){
    let startX=0, startY=0, dragging=false;
    card.addEventListener('pointerdown', (e)=>{ card.setPointerCapture(e.pointerId); dragging=true; startX=e.clientX; startY=e.clientY; card.style.transition='none'; });
    card.addEventListener('pointermove', (e)=>{ if(!dragging) return; const dx = e.clientX - startX; const dy = e.clientY - startY; card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx*0.03}deg) scale(0.98)`; card.style.opacity = Math.max(0.4, 1 - Math.abs(dx)/600); });
    card.addEventListener('pointerup', (e)=>{ dragging=false; card.releasePointerCapture(e.pointerId); const dx = e.clientX - startX; if(Math.abs(dx) > 140){ card.style.transition = 'transform .4s ease, opacity .4s ease'; const dir = dx>0?1:-1; card.style.transform = `translate(${dir*800}px, ${-50}px) rotate(${dir*20}deg)`; card.style.opacity=0; setTimeout(()=>{ card.remove(); },420); } else { card.style.transition='transform .28s cubic-bezier(.2,.9,.2,1)'; card.style.transform='translate(0,0) rotate(0) scale(1)'; card.style.opacity=1; } });
    card.addEventListener('touchstart', (e)=>{ e.preventDefault(); }, {passive:false});
  }

  function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
});
