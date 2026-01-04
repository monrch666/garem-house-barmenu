/* ====== ADMIN PANEL — FILE BASED ====== */

const DEFAULT_ADMIN = 'admin123';

/* ====== Авторизация ====== */
if (!localStorage.getItem('garem_pass_admin')) {
  localStorage.setItem('garem_pass_admin', DEFAULT_ADMIN);
}

const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const tabs = document.querySelectorAll('.tab-btn');
const tabEls = document.querySelectorAll('.tab');

if (loginBtn) loginBtn.addEventListener('click', tryLogin);
if (passwordInput) passwordInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
});

function tryLogin() {
  const pw = passwordInput.value.trim();
  if (pw === localStorage.getItem('garem_pass_admin')) {
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    loadAll();
  } else {
    alert('Неверный пароль');
  }
}

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tabEls.forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ====== API ====== */
async function loadMenu() {
  const r = await fetch('api.php');
  return await r.json();
}

async function saveMenu(menu) {
  const r = await fetch('api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menu, null, 2)
  });

  if (!r.ok) throw new Error('Save failed');
}

/* ====== Загрузка ====== */
async function loadAll() {
  const menu = await loadMenu();
  renderCategories(menu);
  renderItems(menu);
  document.getElementById('admin-pass').value =
    localStorage.getItem('garem_pass_admin');
}

/* ====== Категории ====== */
function renderCategories(menu) {
  const el = document.getElementById('categories-list');
  el.innerHTML = '';

  Object.keys(menu).forEach(cat => {
    const row = document.createElement('div');
    row.className = 'form-row';
    row.innerHTML = `
      <input value="${cat}">
      <button class="btn rename">Переименовать</button>
      <button class="btn danger delete">Удалить</button>
    `;
    el.appendChild(row);

    row.querySelector('.rename').onclick = async () => {
      const newName = row.querySelector('input').value.trim();
      if (!newName || newName === cat) return;

      menu[newName] = menu[cat];
      delete menu[cat];
      await saveMenu(menu);
      loadAll();
    };

    row.querySelector('.delete').onclick = async () => {
      if (!confirm('Удалить категорию?')) return;
      delete menu[cat];
      await saveMenu(menu);
      loadAll();
    };
  });
}

document.getElementById('add-cat').onclick = async () => {
  const name = document.getElementById('new-cat-name').value.trim();
  if (!name) return alert('Введите название');

  const menu = await loadMenu();
  menu[name] = [];
  await saveMenu(menu);
  loadAll();
};

/* ====== Позиции ====== */
function renderItems(menu) {
  const el = document.getElementById('items-list');
  const sel = document.getElementById('item-cat');
  el.innerHTML = '';
  sel.innerHTML = '';

  Object.keys(menu).forEach(cat => {
    sel.innerHTML += `<option>${cat}</option>`;
    el.innerHTML += `<h3>${cat}</h3>`;

    menu[cat].forEach((it, i) => {
      el.innerHTML += `
        <div class="form-row">
          <input class="item-name" value="${escapeHtml(it.name)}">
          <input class="item-price" value="${escapeHtml(it.price)}">
          <input class="item-photo" value="${escapeHtml(it.photo || '')}">
          <label><input type="checkbox" class="item-active" ${it.active ? 'checked' : ''}> Видно</label>
          <button class="btn danger del" data-cat="${cat}" data-i="${i}">Удалить</button>
        </div>
      `;
    });
  });

  el.querySelectorAll('.del').forEach(btn => {
    btn.onclick = async () => {
      if (!confirm('Удалить позицию?')) return;
      const menu = await loadMenu();
      menu[btn.dataset.cat].splice(btn.dataset.i, 1);
      await saveMenu(menu);
      loadAll();
    };
  });

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn wide';
  saveBtn.textContent = '💾 Сохранить всё меню';
  el.appendChild(saveBtn);

  saveBtn.onclick = async () => {
    const newMenu = {};
    const cats = el.querySelectorAll('h3');

    cats.forEach((h3, idx) => {
      const cat = h3.textContent;
      newMenu[cat] = [];
      let node = h3.nextElementSibling;

      while (node && node.tagName !== 'H3') {
        if (node.classList.contains('form-row')) {
          newMenu[cat].push({
            name: node.querySelector('.item-name').value,
            price: node.querySelector('.item-price').value,
            photo: node.querySelector('.item-photo').value,
            active: node.querySelector('.item-active').checked
          });
        }
        node = node.nextElementSibling;
      }
    });

    await saveMenu(newMenu);
    alert('✅ Меню сохранено');
  };
}

document.getElementById('add-item').onclick = async () => {
  const cat = document.getElementById('item-cat').value;
  const name = document.getElementById('item-name').value.trim();
  const price = document.getElementById('item-price').value.trim();
  if (!name) return alert('Введите название');

  const menu = await loadMenu();
  menu[cat].push({ name, price, photo: '', active: true });
  await saveMenu(menu);
  loadAll();
};

/* ====== Пароль ====== */
document.getElementById('save-admin-pass').onclick = () => {
  const p = document.getElementById('admin-pass').value.trim();
  if (!p) return alert('Пароль пуст');
  localStorage.setItem('garem_pass_admin', p);
  alert('Сохранено');
};

document.getElementById('logout').onclick = () => location.reload();

function escapeHtml(s) {
  return (s + '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
