document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menu-list');

  // === 🔧 Настройки JSONBin ===
  const JSONBIN_ID = '68fb613843b1c97be97d0e0e';
  const JSONBIN_KEY = '$2a$10$iWaW8ZYQnb2ifBzumJgsVeUvO2gpzQ7cKnt0rm.BmMu8JKpy4aN7m';

  // === Загрузка меню ===
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
          { "name": "Мохито", "price": "500₽", "photo": "https://via.placeholder.com/400x300?text=Mojito", "active": true },
          { "name": "Пина Колада", "price": "550₽", "photo": "https://via.placeholder.com/400x300?text=Pina+Colada", "active": true }
        ]
      };
    }
  }

  // === Безопасное отображение текста ===
  function escapeHtml(s) {
    return (s + '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // === Рендер меню ===
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
              <div class="top">
                <div class="name">${escapeHtml(i.name)}</div>
                <div class="price">${escapeHtml(i.price)}</div>
              </div>
              ${i.photo ? `
              <div class="photo-container">
                <img src="${escapeHtml(i.photo)}" alt="${escapeHtml(i.name)}">
              </div>` : ''}
            </div>` : '').join('')}
        </div>
      `;

      const head = catEl.querySelector('.cat-head');
      const itemsDiv = catEl.querySelector('.items');

      // === Раскрытие категории ===
      head.addEventListener('click', () => {
        const open = catEl.classList.toggle('open');
        const chev = head.querySelector('.chev');
        chev.style.transform = open ? 'rotate(90deg)' : 'rotate(0deg)';
        if (open) {
          itemsDiv.style.maxHeight = itemsDiv.scrollHeight + 'px';
          setTimeout(() => (itemsDiv.style.maxHeight = 'none'), 400); // потом снимаем ограничение
        } else {
          itemsDiv.style.maxHeight = itemsDiv.scrollHeight + 'px';
          requestAnimationFrame(() => {
            itemsDiv.style.maxHeight = '0';
          });
        }
      });

      // === Фото по клику на позицию ===
      const itemEls = catEl.querySelectorAll('.item');
      itemEls.forEach(item => {
        const photo = item.querySelector('.photo-container');
        if (!photo) return;

        photo.style.maxHeight = '0';
        photo.style.overflow = 'hidden';
        photo.style.transition = 'max-height 0.5s ease, opacity 0.5s ease, margin-top 0.3s ease';
        photo.style.opacity = '0';
        photo.style.marginTop = '0';

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = photo.classList.contains('open');
          if (open) {
            photo.classList.remove('open');
            photo.style.maxHeight = '0';
            photo.style.opacity = '0';
            photo.style.marginTop = '0';
          } else {
            photo.classList.add('open');
            photo.style.maxHeight = '400px';
            photo.style.opacity = '1';
            photo.style.marginTop = '10px';

            // автопрокрутка к открытому фото
            setTimeout(() => {
              photo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
          }
        });
      });

      menuList.appendChild(catEl);
    });
  }

  const menuData = await loadMenu();
  renderMenu(menuData);
});
