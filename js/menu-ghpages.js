document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menu-list');

  // try localStorage first
  let menuData = null;
  try { menuData = JSON.parse(localStorage.getItem('garem_menu')); } catch(e){ menuData = null; }

  if(!menuData) {
    try {
      const url = './data/menu.json?nocache=' + Date.now();
      const res = await fetch(url);
      if(!res.ok) throw new Error('HTTP ' + res.status);
      menuData = await res.json();
      localStorage.setItem('garem_menu', JSON.stringify(menuData));
    } catch (e) {
      console.warn('Не удалось загрузить data/menu.json:', e);
      // fallback sample
      menuData = {
        "Коктейли":[{"name":"Мохито","price":"500₽","active":true},{"name":"Пина Колада","price":"550₽","active":true}]
      };
    }
  }

  function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  Object.entries(menuData).forEach(([catName, items])=>{
    const catEl = document.createElement('div');
    catEl.className = 'category card';
    const visibleCount = items.filter(i=>i.active).length;
    catEl.innerHTML = `
      <div class="cat-head">
        <div>
          <div class="cat-title">${escapeHtml(catName)}</div>
          <div class="cat-badge">${visibleCount} позиций</div>
        </div>
        <div class="chev">▸</div>
      </div>
      <div class="items">${items.map(i=> i.active ? `<div class="item"><div class="name">${escapeHtml(i.name)}</div><div class="price">${escapeHtml(i.price)}</div></div>` : '').join('')}</div>
    `;
    const head = catEl.querySelector('.cat-head');
    const itemsDiv = catEl.querySelector('.items');
    head.addEventListener('click', ()=>{
      const open = itemsDiv.classList.contains('open');
      if(open){ itemsDiv.classList.remove('open'); itemsDiv.style.maxHeight='0'; }
      else { itemsDiv.classList.add('open'); itemsDiv.style.maxHeight = itemsDiv.scrollHeight + 'px'; }
    });
    menuList.appendChild(catEl);
  });
});
