// ===== Стили — всё в JS =====
const css = `
*{box-sizing:border-box}body{margin:0;font-family:system-ui,Segoe UI,Roboto,Arial;background:#f7f7f7;color:#222}
#app{max-width:980px;margin:16px auto;background:#fff;padding:16px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.topwrap{background:#222}.topwrap .inner{max-width:980px;margin:0 auto;padding:12px 16px;display:flex;gap:24px;align-items:center}
.topwrap a{color:#fff;margin-right:12px;text-decoration:none}.topwrap a:hover{text-decoration:underline}
h2{margin-top:0}.table{width:100%;border-collapse:collapse}.table th,.table td{border-bottom:1px solid #eee;padding:8px;text-align:left}
.table th{background:#fafafa}.row-actions{display:flex;gap:8px}.btn{padding:6px 10px;border:1px solid #ddd;background:#fafafa;border-radius:6px;cursor:pointer}
.btn:hover{background:#f0f0f0}.btn-primary{background:#0d6efd;color:#fff;border-color:#0d6efd}.btn-primary:hover{background:#0b5ed7}
.form fieldset{display:grid;grid-template-columns:1fr 2fr;gap:10px;border:none;padding:0;margin:0 0 12px 0}.form label{padding:6px 0;color:#555}
.form input{padding:8px;border:1px solid #ccc;border-radius:6px}.form .actions{display:flex;gap:8px}
.badge{display:inline-block;padding:2px 8px;border-radius:12px;background:#eef;border:1px solid #dde;color:#225;font-size:12px}
.alert{padding:8px 12px;border:1px solid #ddd;background:#fefbea;border-radius:6px;margin:8px 0 16px;color:#5c4b10}.empty{color:#888;font-style:italic}
`;
const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

// ===== Верхняя панель =====
const top = document.createElement('div');
top.className='topwrap';
top.innerHTML = `<div class="inner"><h1 style="font-size:18px;color:#fff;margin:0">StroyMarket — SPA (ЛР2)</h1>
<nav><a href="#/list">Список</a> <a href="#/create">Добавить</a></nav></div>`;
document.body.prepend(top);

// ===== Контейнер приложения =====
let app = document.getElementById('app');
if (!app) { app = document.createElement('div'); app.id='app'; document.body.appendChild(app); }

// ===== Моки в памяти =====
const state = {
  products: [
    { id:1, sku:'cement-m500', name:'Цемент М500', price:350.00, quantity:100 },
    { id:2, sku:'brick-red',   name:'Кирпич красный', price:25.50, quantity:500 },
    { id:3, sku:'paint-white', name:'Краска 10л белая', price:1299.00, quantity:20 },
  ],
  nextId: 4,
};

// ===== «API»-слой (пока моки) =====
const api = {
  list(){ return Promise.resolve([...state.products]); },
  get(id){ const p=state.products.find(x=>x.id==id); return Promise.resolve(p?{...p}:null); },
  create(data){ const it={ id:state.nextId++, ...data, price:+data.price, quantity:+data.quantity }; state.products.push(it); return Promise.resolve({...it}); },
  update(id,data){ const i=state.products.findIndex(x=>x.id==id); if(i<0)return Promise.resolve(null); const u={...state.products[i],...data}; u.price=+u.price; u.quantity=+u.quantity; state.products[i]=u; return Promise.resolve({...u}); },
  remove(id){ const i=state.products.findIndex(x=>x.id==id); if(i<0)return Promise.resolve({status:'not_found'}); state.products.splice(i,1); return Promise.resolve({status:'ok'}); },
};

// ===== Роутер по hash =====
const routes = {
  '/list': renderList,
  '/create': ()=>renderForm('create'),
  '/edit': ({id})=>renderForm('edit', +id),
  '/view': ({id})=>renderView(+id),
};
function parseHash(){ const h=location.hash.slice(1)||'/list'; const a=h.split('/').filter(Boolean); return {route:`/${a[0]||'list'}`, params:{id:a[1]}}; }
function go(to){ location.hash = to; }
window.addEventListener('hashchange', renderByRoute);
window.addEventListener('DOMContentLoaded', ()=>{ if(!location.hash) go('#/list'); renderByRoute(); });

function renderByRoute(){ const {route, params} = parseHash(); (routes[route]||renderList)(params); }

// ===== Компоненты =====
function renderList(){
  api.list().then(items=>{
    app.innerHTML = `
      <h2>Товары <span class="badge">${items.length}</span></h2>
      ${items.length? `
      <table class="table"><thead><tr><th>ID</th><th>SKU</th><th>Название</th><th>Цена</th><th>Кол-во</th><th></th></tr></thead>
      <tbody>
        ${items.map(p=>`
          <tr data-id="${p.id}">
            <td>${p.id}</td><td>${e(p.sku)}</td><td>${e(p.name)}</td>
            <td>${(+p.price).toFixed(2)}</td><td>${p.quantity}</td>
            <td class="row-actions">
              <button class="btn" data-a="view">Открыть</button>
              <button class="btn" data-a="edit">Править</button>
              <button class="btn" data-a="del">Удалить</button>
            </td>
          </tr>`).join('')}
      </tbody></table>` : `<p class="empty">Пусто. Нажмите «Добавить».</p>`}
    `;
    app.querySelectorAll('tbody tr').forEach(tr=>{
      tr.addEventListener('click', (ev)=>{
        const id=+tr.dataset.id;
        const a=ev.target.getAttribute('data-a');
        if(a==='view') go(`#/view/${id}`);
        if(a==='edit') go(`#/edit/${id}`);
        if(a==='del' && confirm(`Удалить #${id}?`)) api.remove(id).then(()=>renderList());
      });
    });
  });
}

function renderForm(mode, id){
  const isEdit = mode==='edit';
  const load = isEdit ? api.get(id) : Promise.resolve({sku:'',name:'',price:'',quantity:''});
  load.then(p=>{
    if(isEdit && !p){ alert('Не найден'); return go('#/list'); }
    app.innerHTML = `
      <h2>${isEdit?`Редактирование #${id}`:'Добавление товара'}</h2>
      <form class="form" id="f">
        <fieldset><label>SKU*</label><input name="sku" required value="${a(p.sku)}"></fieldset>
        <fieldset><label>Название*</label><input name="name" required value="${a(p.name)}"></fieldset>
        <fieldset><label>Цена*</label><input name="price" type="number" step="0.01" min="0" required value="${a(p.price)}"></fieldset>
        <fieldset><label>Количество*</label><input name="quantity" type="number" step="1" min="0" required value="${a(p.quantity)}"></fieldset>
        <div class="actions">
          <button class="btn btn-primary" type="submit">${isEdit?'Сохранить':'Создать'}</button>
          <button class="btn" type="button" id="cancel">Отмена</button>
        </div>
      </form>`;
    document.getElementById('cancel').onclick = ()=>go('#/list');
    document.getElementById('f').onsubmit = (ev)=>{
      ev.preventDefault();
      const fd = Object.fromEntries(new FormData(ev.target).entries());
      if(isEdit){ api.update(id, fd).then(()=>go(`#/view/${id}`)); }
      else      { api.create(fd).then(newItem=>go(`#/view/${newItem.id}`)); }
    };
  });
}

function renderView(id){
  api.get(id).then(p=>{
    if(!p){ alert('Не найден'); return go('#/list'); }
    app.innerHTML = `
      <h2>Товар #${p.id}</h2>
      <p><b>SKU:</b> ${e(p.sku)}</p>
      <p><b>Название:</b> ${e(p.name)}</p>
      <p><b>Цена:</b> ${(+p.price).toFixed(2)}</p>
      <p><b>Количество:</p> ${p.quantity}</p>
      <div class="actions">
        <button class="btn" onclick="location.hash='#/list'">К списку</button>
        <button class="btn btn-primary" onclick="location.hash='#/edit/${p.id}'">Редактировать</button>
      </div>`;
  });
}

// helpers
function e(s){ return String(s??'').replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
function a(s){ return e(s); }
