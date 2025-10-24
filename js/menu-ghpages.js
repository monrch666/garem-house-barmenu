document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menu-list');

  // === 🔧 Настройки JSONBin ===
  const JSONBIN_ID = '68fb613843b1c97be97d0e0e'; // вставь сюда ID bin
  const JSONBIN_KEY = '$2a$10$iWaW8ZYQnb2ifBzumJgsVeUvO2gpzQ7cKnt0rm.BmMu8JKpy4aN7m'; // вставь сюда API ключ

  async function loadMenu() {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest?nocache=${Date.now()}`, {
        headers: { 'X-Master-Key': JSONBIN_KEY }
      });
      if (!res.ok) throw new Error('Ошибка загрузки JSONBin: ' + res.status);
      const data = await res.json();
      return data.record;
    } catch (e) {
      console.error('Ошибка загрузки меню с JSONBin:', e);
      return {
        "Коктейли": [
          { "name": "Мохито", "price": "500₽", "active": true },
          { "name": "Пина Колада", "price": "550₽", "active": true }
        ]
      };
    }
  }

  function escapeHtml(s) {
    return (s + '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function renderMenu(menuData) {
    menuList.innerHTML = '';
    Object.entries(menuData).forEach(([catName, items]) => {
      const catEl = document.createElement('div');
      catEl.className = 'category card';
      const visibleCount = items.filter(i => i.active).length;
      catEl.innerHTML = `
        <div class="cat-head">
          <div>
            <div class="cat-title">${escapeHtml(catName)}</div>
            <div class="cat-badge">${visibleCount} позиций</div>
          </div>
          <div class="chev">▸</div>
        </div>
        <div class="items">
          ${items.map(i => i.active ? `
            <div class="item">
              <div class="name">${escapeHtml(i.name)}</div>
              <div class="price">${escapeHtml(i.price)}</div>
            </div>` : '').join('')}
        </div>
      `;
      const head = catEl.querySelector('.cat-head');
      const itemsDiv = catEl.querySelector('.items');
      head.addEventListener('click', () => {
        const open = itemsDiv.classList.contains('open');
        if (open) {
          itemsDiv.classList.remove('open');
          itemsDiv.style.maxHeight = '0';
        } else {
          itemsDiv.classList.add('open');
          itemsDiv.style.maxHeight = itemsDiv.scrollHeight + 'px';
        }
      });
      menuList.appendChild(catEl);
    });
  }

  const menuData = await loadMenu();
  renderMenu(menuData);
});
