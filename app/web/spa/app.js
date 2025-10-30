// app/web/spa/app.js

// ====== настройки ======
// у тебя контроллер обслуживает /products
const PRODUCTS_URL = '/products';

// если API закрыт — впиши сюда токен
// const AUTH_TOKEN = 'Bearer CHANGE_ME_SECRET';
const AUTH_TOKEN = null;

// ====== состояние ======
let items = [];
let selectedId = null;

// ====== HTTP ======
async function apiGet(url) {
  const headers = {};
  if (AUTH_TOKEN) headers['Authorization'] = AUTH_TOKEN;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error('GET ' + url + ' → ' + res.status);
  }
  return res.json();
}

async function apiPostForm(url, formData) {
  const headers = {};
  if (AUTH_TOKEN) headers['Authorization'] = AUTH_TOKEN;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('POST ' + url + ' → ' + res.status + ' ' + text);
  }
  return res.json();
}

async function apiPutJson(url, data) {
  const headers = { 'Content-Type': 'application/json' };
  if (AUTH_TOKEN) headers['Authorization'] = AUTH_TOKEN;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('PUT ' + url + ' → ' + res.status + ' ' + text);
  }
  return res.json();
}

async function apiDelete(url) {
  const headers = {};
  if (AUTH_TOKEN) headers['Authorization'] = AUTH_TOKEN;

  const res = await fetch(url, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('DELETE ' + url + ' → ' + res.status + ' ' + text);
  }
  return true;
}

// ====== список ======
const listCallbacks = {
  onSelect: (id) => selectItem(id),
  onEdit: (item) => window.SPA_Form.fill(item),
  onDelete: (id) => removeItem(id),
};

function renderAll() {
  window.SPA_List.render(items, selectedId, listCallbacks);
  const current = items.find((i) => i.id === selectedId) || null;
  window.SPA_Details.render(current);
}

function selectItem(id) {
  selectedId = id;
  renderAll();
}

// ====== загрузка с бэка ======
async function loadProducts() {
  const data = await apiGet(PRODUCTS_URL);
  // вдруг вернётся {items:[...]}
  items = Array.isArray(data) ? data : data.items || [];
  // если выбранного id больше нет (например, удалили) — сбрасываем
  if (selectedId && !items.find((i) => i.id === selectedId)) {
    selectedId = null;
  }
  renderAll();
}

// ====== создание ======
async function createProduct(data) {
  const fd = new FormData();
  fd.append('name', data.name);
  fd.append('sku', data.sku);
  fd.append('price', data.price);
  fd.append('category', data.category || '');
  fd.append('description', data.description || '');

  await apiPostForm(PRODUCTS_URL, fd);
  // ВАЖНО: после успешного POST ещё раз забираем всё из БД
  await loadProducts();
}

// ====== обновление ======
async function updateProduct(data) {
  const url = PRODUCTS_URL + '/' + data.id;
  await apiPutJson(url, {
    name: data.name,
    sku: data.sku,
    price: data.price,
    category: data.category,
    description: data.description,
  });
  // тоже перечитываем с бэка — чтобы взять уже обновлённую версию
  selectedId = data.id;
  await loadProducts();
}

// ====== удаление ======
async function removeItem(id) {
  if (!confirm('Удалить товар #' + id + '?')) return;
  const url = PRODUCTS_URL + '/' + id;
  await apiDelete(url);
  // после удаления тоже перечитаем
  selectedId = null;
  await loadProducts();
}

// ====== инициализация формы ======
window.SPA_Form.init(async (data) => {
  try {
    if (data.id) {
      await updateProduct(data);
      window.SPA_Form.clear();
    } else {
      await createProduct(data);
      window.SPA_Form.clear();
    }
  } catch (err) {
    console.error(err);
    alert('Ошибка сохранения: ' + err.message);
  }
});

// ====== старт ======
window.addEventListener('DOMContentLoaded', () => {
  loadProducts().catch((err) => {
    console.error(err);
    alert('Не удалось загрузить товары с API');
  });
});
