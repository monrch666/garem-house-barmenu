/* Admin panel — localStorage + jsonbin.io sync */
const DEFAULT_ADMIN = 'admin123';
const DEFAULT_BARMAN = 'bar123';

/* 🔗 Настройки jsonbin.io */
const JSONBIN_MENU_ID = "68fb613843b1c97be97d0e0e";
const JSONBIN_STAFF_ID = "68fb6260ae596e708f28cd6f";
const JSONBIN_KEY = "$2a$10$iWaW8ZYQnb2ifBzumJgsVeUvO2gpzQ7cKnt0rm.BmMu8JKpy4aN7m";
const JSONBIN_BASE = "https://api.jsonbin.io/v3/b/";

/* ====== Авторизация ====== */
function ensurePasswords() {
  if (!localStorage.getItem('garem_pass_admin'))
    localStorage.setItem('garem_pass_admin', DEFAULT_ADMIN);
  if (!localStorage.getItem('garem_pass_barman'))
    localStorage.setItem('garem_pass_barman', DEFAULT_BARMAN);
}
ensurePasswords();

const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const tabs = document.querySelectorAll('.tab-btn');
const tabEls = document.querySelectorAll('.tab');
let currentRole = null;

if (loginBtn) loginBtn.addEventListener('click', tryLogin);
if (passwordInput) passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryLogin(); });

function tryLogin() {
  const pw = passwordInput.value.trim();
  const adminPW = localStorage.getItem('garem_pass_admin');
  const barmanPW = localStorage.getItem('garem_pass_barman');
  if (pw === adminPW) enterAs('admin');
  else if (pw === barmanPW) enterAs('barman');
  else alert('Неверный пароль');
}

function enterAs(role) {
  currentRole = role;
  loginSection.classList.add('hidden');
  adminSection.classList.remove('hidden');
  if (role === 'barman') {
    document.querySelectorAll('.tab-btn')[2].style.display = 'none';
  }
  loadAll();
}

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tabEls.forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ====== jsonbin.io helpers ====== */
async function fetchJson(binId) {
  try {
    const r = await fetch(JSONBIN_BASE + binId + "/latest", {
      headers: { "X-Master-Key": JSONBIN_KEY }
    });
    const data = await r.json();
    return data.record;
  } catch (e) {
    console.warn("Ошибка загрузки из jsonbin.io", e);
    return null;
  }
}

async function saveJson(binId, data) {
  try {
    await fetch(JSONBIN_BASE + binId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_KEY
      },
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.warn("Ошибка сохранения в jsonbin.io", e);
  }
}

/* ====== Загрузка данных ====== */
async function loadAll() {
  let menu = await fetchJson(JSONBIN_MENU_ID);
  let staff = await fetchJson(JSONBIN_STAFF_ID);

  if (!menu) menu = JSON.parse(localStorage.getItem('garem_menu')) || {};
  if (!staff) staff = JSON.parse(localStorage.getItem('garem_staff')) || [];

  // синхронизировать с localStorage
  localStorage.setItem('garem_menu', JSON.stringify(menu));
  localStorage.setItem('garem_staff', JSON.stringify(staff));

  renderCategories(menu);
  renderItems(menu);
  renderStaffList(staff);

  document.getElementById('admin-pass').value = localStorage.getItem('garem_pass_admin');
  document.getElementById('barman-pass').value = localStorage.getItem('garem_pass_barman');
}

/* ====== Категории ====== */
function renderCategories(menu) {
  const el = document.getElementById('categories-list');
  el.innerHTML = '';
  Object.keys(menu).forEach((k, idx) => {
    const row = document.createElement('div');
    row.className = 'form-row';
    row.innerHTML = `<input value="${k}" data-idx="${idx}">
                     <button class="btn" data-idx="${idx}">Переименовать</button>
                     <button class="btn danger" data-del="${k}">Удалить</button>`;
    el.appendChild(row);

    row.querySelector('button').addEventListener('click', async (e) => {
      const newName = row.querySelector('input').value.trim();
      if (!newName) return;
      const tmp = JSON.parse(JSON.stringify(menu));
      const keys = Object.keys(tmp);
      const old = keys[e.target.dataset.idx];
      tmp[newName] = tmp[old]; delete tmp[old];
      localStorage.setItem('garem_menu', JSON.stringify(tmp));
      await saveJson(JSONBIN_MENU_ID, tmp);
      window.location.reload();
    });

    row.querySelector('[data-del]').addEventListener('click', async (e) => {
      if (!confirm('Удалить категорию?')) return;
      const name = e.target.dataset.del;
      delete menu[name];
      localStorage.setItem('garem_menu', JSON.stringify(menu));
      await saveJson(JSONBIN_MENU_ID, menu);
      loadAll();
    });
  });
}

document.getElementById('add-cat').addEventListener('click', async () => {
  const name = document.getElementById('new-cat-name').value.trim();
  if (!name) return alert('Введите название');
  const menu = JSON.parse(localStorage.getItem('garem_menu')) || {};
  menu[name] = [];
  localStorage.setItem('garem_menu', JSON.stringify(menu));
  await saveJson(JSONBIN_MENU_ID, menu);
  loadAll();
});

/* ====== Позиции ====== */
function renderItems(menu) {
  const el = document.getElementById('items-list');
  const sel = document.getElementById('item-cat');
  el.innerHTML = '';
  sel.innerHTML = '';

  Object.keys(menu).forEach((k, idx) => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = k;
    sel.appendChild(opt);

    const catTitle = document.createElement('h3');
    catTitle.textContent = k;
    catTitle.style.marginTop = '15px';
    el.appendChild(catTitle);

    menu[k].forEach((it, i2) => {
      const r = document.createElement('div');
      r.className = 'form-row';
      r.innerHTML = `
        <input class="item-name" value="${escapeHtml(it.name)}" placeholder="Название">
        <input class="item-price" value="${escapeHtml(it.price)}" placeholder="Цена">
        <input class="item-photo" value="${escapeHtml(it.photo || '')}" placeholder="Ссылка на фото">
        <label><input type="checkbox" class="item-active" ${it.active ? 'checked' : ''}> Видно</label>
        <button class="btn danger" data-del="${k}" data-i="${i2}">Удалить</button>
      `;
      el.appendChild(r);

      // удаление
      r.querySelector('[data-del]').addEventListener('click', async (e) => {
        if (!confirm('Удалить позицию?')) return;
        const k = e.target.dataset.del, i = e.target.dataset.i;
        menu[k].splice(i, 1);
        localStorage.setItem('garem_menu', JSON.stringify(menu));
        await saveJson(JSONBIN_MENU_ID, menu);
        loadAll();
      });
    });
  });

  // === Общая кнопка сохранения всех изменений ===
  const saveAllBtn = document.createElement('button');
  saveAllBtn.textContent = '💾 Сохранить всё меню';
  saveAllBtn.className = 'btn wide';
  saveAllBtn.style.marginTop = '20px';
  el.appendChild(saveAllBtn);

  saveAllBtn.addEventListener('click', async () => {
    // собрать все поля обратно в структуру menu
    const catEls = document.querySelectorAll('#items-list h3');
    const rows = document.querySelectorAll('#items-list .form-row');

    let newMenu = {};
    let currentCat = null;
    let catIndex = 0;

    catEls.forEach((catEl, catIdx) => {
      const catName = catEl.textContent.trim();
      newMenu[catName] = [];
    });

    // распределяем позиции по категориям
    catEls.forEach((catEl, catIdx) => {
      const nextCat = catEls[catIdx + 1];
      const rowsInCat = [];
      let node = catEl.nextElementSibling;
      while (node && node !== nextCat) {
        if (node.classList.contains('form-row')) rowsInCat.push(node);
        node = node.nextElementSibling;
      }
      newMenu[catEl.textContent.trim()] = rowsInCat.map(r => ({
        name: r.querySelector('.item-name').value.trim(),
        price: r.querySelector('.item-price').value.trim(),
        photo: r.querySelector('.item-photo').value.trim(),
        active: r.querySelector('.item-active').checked
      }));
    });

    localStorage.setItem('garem_menu', JSON.stringify(newMenu));
    await saveJson(JSONBIN_MENU_ID, newMenu);
    alert('✅ Меню успешно сохранено!');
    loadAll();
  });
}

document.getElementById('add-item').addEventListener('click', async () => {
  const cat = document.getElementById('item-cat').value;
  const name = document.getElementById('item-name').value.trim();
  const price = document.getElementById('item-price').value.trim();
  if (!cat || !name) return alert('Заполните поля');
  const menu = JSON.parse(localStorage.getItem('garem_menu')) || {};
  menu[cat].push({ id: 'i' + Date.now(), name, price, photo: '', active: true });
  localStorage.setItem('garem_menu', JSON.stringify(menu));
  await saveJson(JSONBIN_MENU_ID, menu);
  loadAll();
});

/* ====== Персонал ====== */
function renderStaffList(staff) {
  const el = document.getElementById('staff-list'); el.innerHTML = '';
  staff.forEach((s, idx) => {
    const r = document.createElement('div'); r.className = 'form-row';
    r.innerHTML = `<input value="${s.name}"><input value="${s.role}"><input value="${s.photo || ''}">
                   <button class="btn" data-i="${idx}">Сохранить</button>
                   <button class="btn danger" data-del="${idx}">Удалить</button>`;
    el.appendChild(r);

    r.querySelector('[data-i]').addEventListener('click', async (e) => {
      const i = e.target.dataset.i;
      const nm = r.querySelectorAll('input')[0].value.trim();
      const rl = r.querySelectorAll('input')[1].value.trim();
      const ph = r.querySelectorAll('input')[2].value.trim();
      staff[i].name = nm; staff[i].role = rl; staff[i].photo = ph;
      localStorage.setItem('garem_staff', JSON.stringify(staff));
      await saveJson(JSONBIN_STAFF_ID, staff);
      loadAll();
    });

    r.querySelector('[data-del]').addEventListener('click', async (e) => {
      if (!confirm('Удалить сотрудника?')) return;
      staff.splice(idx, 1);
      localStorage.setItem('garem_staff', JSON.stringify(staff));
      await saveJson(JSONBIN_STAFF_ID, staff);
      loadAll();
    });
  });
}

document.getElementById('add-staff').addEventListener('click', async () => {
  const name = document.getElementById('staff-name').value.trim();
  const role = document.getElementById('staff-role').value.trim();
  const photo = document.getElementById('staff-photo').value.trim();
  if (!name) return alert('Введите имя');
  const staff = JSON.parse(localStorage.getItem('garem_staff')) || [];
  staff.push({ id: 's' + Date.now(), name, role, photo });
  localStorage.setItem('garem_staff', JSON.stringify(staff));
  await saveJson(JSONBIN_STAFF_ID, staff);
  loadAll();
});

/* ====== Пароли ====== */
document.getElementById('save-admin-pass').addEventListener('click', () => {
  if (currentRole !== 'admin') return alert('Только админ может менять пароли');
  const p = document.getElementById('admin-pass').value.trim();
  if (!p) return alert('Пароль пуст');
  localStorage.setItem('garem_pass_admin', p);
  alert('Сохранено');
});

document.getElementById('save-barman-pass').addEventListener('click', () => {
  if (currentRole !== 'admin') return alert('Только админ может менять пароли');
  const p = document.getElementById('barman-pass').value.trim();
  if (!p) return alert('Пароль пуст');
  localStorage.setItem('garem_pass_barman', p);
  alert('Сохранено');
});

document.getElementById('logout').addEventListener('click', () => { location.reload(); });

function escapeHtml(s) { return (s + '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
