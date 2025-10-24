document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menu-list');

  // === 🔧 Настройки JSONBin ===
  const JSONBIN_ID = '68fb613843b1c97be97d0e0e'; // вставь сюда ID своего bin
  const JSONBIN_KEY = '$2a$10$iWaW8ZYQnb2ifBzumJgsVeUvO2gpzQ7cKnt0rm.BmMu8JKpy4aN7m'; // вставь сюда API-ключ JSONBin

  // === Попытка загрузить из localStorage ===
  let menuData = null;
  try {
    menuData = JSON.parse(localStorage.getItem('garem_menu'));
  } catch (e) {
    menuData = null;
  }

  // === Если в localStorage пусто — грузим с JSONBin ===
  if (!menuData) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest?nocache=${Date.now()}`, {
        headers: {
          'X-Master-Key': JSONBIN_KEY
        }
      });
      if (!res.ok) throw new Error('Ошибка загрузки: ' + res.status);
      const data = await res.json();
      menuData = data.record;
      localStorage.setItem('garem_menu', JSON.stringify(menuData));
      console.log('Меню загружено с JSONBin');
    } catch (e) {
      console.warn('Не удалось загрузить меню с JSONBin:', e);
      try {
        const res = await fetch('./data/menu.json?nocache=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        menuData = await res.json();
        localStorage.setItem('garem_menu', JSON.stringify(menuData));
      } catch (err) {
        console.error('Не удалось загрузить даже локальный JSON, использую пример:', err);
        menuData = {
          "Коктейли": [
            { "name": "Мохито", "price": "500₽", "active": true },
            { "name": "Пина Колада", "price": "550₽", "active": true }
          ]
        };
      }
    }
  }

  // === Функция экранирования ===
  function escapeHtml(s) {
    return (s + '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  // === Отрисовка категорий ===
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
});
