/* Admin panel — localStorage manager */
const DEFAULT_ADMIN = 'admin123';
const DEFAULT_BARMAN = 'bar123';

function ensurePasswords(){ if(!localStorage.getItem('garem_pass_admin')) localStorage.setItem('garem_pass_admin', DEFAULT_ADMIN); if(!localStorage.getItem('garem_pass_barman')) localStorage.setItem('garem_pass_barman', DEFAULT_BARMAN); }
ensurePasswords();

const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const tabs = document.querySelectorAll('.tab-btn');
const tabEls = document.querySelectorAll('.tab');
let currentRole = null;

if(loginBtn) loginBtn.addEventListener('click', tryLogin);
if(passwordInput) passwordInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') tryLogin(); });

function tryLogin(){
  const pw = passwordInput.value.trim();
  const adminPW = localStorage.getItem('garem_pass_admin');
  const barmanPW = localStorage.getItem('garem_pass_barman');
  if(pw === adminPW){ enterAs('admin'); }
  else if(pw === barmanPW){ enterAs('barman'); }
  else { alert('Неверный пароль'); }
}

function enterAs(role){
  currentRole = role;
  loginSection.classList.add('hidden');
  adminSection.classList.remove('hidden');
  if(role==='barman') { document.querySelectorAll('.tab-btn')[2].style.display = 'none'; }
  loadAll();
}

tabs.forEach(btn=>{ btn.addEventListener('click', ()=>{ tabs.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); tabEls.forEach(t=>t.classList.remove('active')); document.getElementById('tab-' + btn.dataset.tab).classList.add('active'); }); });

function loadAll(){
  const menu = JSON.parse(localStorage.getItem('garem_menu')) || {};
  renderCategories(menu);
  renderItems(menu);
  const staff = JSON.parse(localStorage.getItem('garem_staff')) || [];
  renderStaffList(staff);
  document.getElementById('admin-pass').value = localStorage.getItem('garem_pass_admin');
  document.getElementById('barman-pass').value = localStorage.getItem('garem_pass_barman');
}

/* Categories and items */
function renderCategories(menu){
  const el = document.getElementById('categories-list');
  el.innerHTML = '';
  Object.keys(menu).forEach((k, idx)=>{
    const row = document.createElement('div'); row.className='form-row';
    row.innerHTML = `<input value="${k}" data-idx="${idx}"><button class="btn" data-idx="${idx}">Переименовать</button><button class="btn danger" data-del="${k}">Удалить</button>`;
    el.appendChild(row);
    row.querySelector('button').addEventListener('click',(e)=>{
      const newName = row.querySelector('input').value.trim();
      if(!newName) return;
      const tmp = JSON.parse(JSON.stringify(menu));
      const keys = Object.keys(tmp);
      const old = keys[e.target.dataset.idx];
      tmp[newName] = tmp[old]; delete tmp[old];
      localStorage.setItem('garem_menu', JSON.stringify(tmp));
      window.location.reload();
    });
    row.querySelector('[data-del]').addEventListener('click',(e)=>{
      if(!confirm('Удалить категорию?')) return;
      const name = e.target.dataset.del;
      delete menu[name];
      localStorage.setItem('garem_menu', JSON.stringify(menu));
      loadAll();
    });
  });
}
document.getElementById('add-cat').addEventListener('click', ()=>{
  const name = document.getElementById('new-cat-name').value.trim();
  if(!name) return alert('Введите название');
  const menu = JSON.parse(localStorage.getItem('garem_menu')) || {};
  menu[name] = [];
  localStorage.setItem('garem_menu', JSON.stringify(menu));
  loadAll();
});

function renderItems(menu){
  const el = document.getElementById('items-list');
  const sel = document.getElementById('item-cat');
  el.innerHTML=''; sel.innerHTML='';
  Object.keys(menu).forEach((k, idx)=>{ const opt = document.createElement('option'); opt.value = k; opt.textContent = k; sel.appendChild(opt);
    menu[k].forEach((it,i2)=>{
      const r = document.createElement('div'); r.className='form-row';
      r.innerHTML = `<input value="${it.name}"><input value="${it.price}"><label><input type="checkbox" ${it.active ? 'checked' : ''}> Видно</label><button class="btn" data-k="${k}" data-i="${i2}">Сохранить</button><button class="btn danger" data-del="${k}" data-i="${i2}">Удалить</button>`;
      el.appendChild(r);
      r.querySelector('[data-k]').addEventListener('click',(e)=>{
        const k = e.target.dataset.k, i = e.target.dataset.i;
        const nm = r.querySelectorAll('input')[0].value.trim();
        const pr = r.querySelectorAll('input')[1].value.trim();
        const visible = r.querySelector('input[type=checkbox]').checked;
        menu[k][i].name = nm; menu[k][i].price = pr; menu[k][i].active = visible;
        localStorage.setItem('garem_menu', JSON.stringify(menu));
        loadAll();
      });
      r.querySelector('[data-del]').addEventListener('click',(e)=>{
        if(!confirm('Удалить позицию?')) return;
        const k = e.target.dataset.del, i = e.target.dataset.i;
        menu[k].splice(i,1);
        localStorage.setItem('garem_menu', JSON.stringify(menu));
        loadAll();
      });
    });
  });
}
document.getElementById('add-item').addEventListener('click', ()=>{
  const cat = document.getElementById('item-cat').value;
  const name = document.getElementById('item-name').value.trim();
  const price = document.getElementById('item-price').value.trim();
  if(!cat || !name) return alert('Заполните поля');
  const menu = JSON.parse(localStorage.getItem('garem_menu')) || {};
  menu[cat].push({ id:'i'+Date.now(), name, price, active:true });
  localStorage.setItem('garem_menu', JSON.stringify(menu));
  loadAll();
});

/* Staff */
function renderStaffList(staff){
  const el = document.getElementById('staff-list'); el.innerHTML='';
  staff.forEach((s,idx)=>{
    const r = document.createElement('div'); r.className='form-row';
    r.innerHTML = `<input value="${s.name}"><input value="${s.role}"><input value="${s.photo || ''}"><button class="btn" data-i="${idx}">Сохранить</button><button class="btn danger" data-del="${idx}">Удалить</button>`;
    el.appendChild(r);
    r.querySelector('[data-i]').addEventListener('click',(e)=>{
      const i = e.target.dataset.i; const nm = r.querySelectorAll('input')[0].value.trim(); const rl = r.querySelectorAll('input')[1].value.trim(); const ph = r.querySelectorAll('input')[2].value.trim();
      staff[i].name = nm; staff[i].role = rl; staff[i].photo = ph;
      localStorage.setItem('garem_staff', JSON.stringify(staff));
      loadAll();
    });
    r.querySelector('[data-del]').addEventListener('click',(e)=>{
      if(!confirm('Удалить сотрудника?')) return;
      staff.splice(idx,1); localStorage.setItem('garem_staff', JSON.stringify(staff)); loadAll();
    });
  });
}
document.getElementById('add-staff').addEventListener('click', ()=>{
  const name = document.getElementById('staff-name').value.trim(); const role = document.getElementById('staff-role').value.trim(); const photo = document.getElementById('staff-photo').value.trim();
  if(!name) return alert('Введите имя');
  const staff = JSON.parse(localStorage.getItem('garem_staff')) || [];
  staff.push({ id:'s'+Date.now(), name, role, photo });
  localStorage.setItem('garem_staff', JSON.stringify(staff)); loadAll();
});

/* Passwords */
document.getElementById('save-admin-pass').addEventListener('click', ()=>{ if(currentRole!=='admin') return alert('Только админ может менять пароли'); const p = document.getElementById('admin-pass').value.trim(); if(!p) return alert('Пароль пуст'); localStorage.setItem('garem_pass_admin', p); alert('Сохранено'); });
document.getElementById('save-barman-pass').addEventListener('click', ()=>{ if(currentRole!=='admin') return alert('Только админ может менять пароли'); const p = document.getElementById('barman-pass').value.trim(); if(!p) return alert('Пароль пуст'); localStorage.setItem('garem_pass_barman', p); alert('Сохранено'); });

document.getElementById('logout').addEventListener('click', ()=>{ location.reload(); });
function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
