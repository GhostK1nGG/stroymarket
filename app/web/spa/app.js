// web/spa/app.js (ЛР2, моки, без API)

import { bus } from './state/bus.js';
import { getAll, getById, create, update, remove } from './services/products.mock.js';
import { ProductList } from './components/ProductList.js';
import { ProductForm } from './components/ProductForm.js';
import { Banner } from './components/Banner.js';

function init() {
  const listRoot = document.getElementById('items-list');
  const formElement = document.getElementById('item-form');
  const bannerRoot = document.getElementById('banner');
  const totalCountEl = document.getElementById('total-count');

  const list = new ProductList(listRoot);
  const form = new ProductForm(formElement);
  // создаём баннер, он сам подпишется на события
  // eslint-disable-next-line no-unused-vars
  const banner = new Banner(bannerRoot);

  function refreshList() {
    const items = getAll();
    list.render(items);
    totalCountEl.textContent = String(items.length);
  }

  // Создание товара
  bus.on('product:create', (data) => {
    try {
      create(data);
      refreshList();
      form.clear();
      bus.emit('banner:info', 'Товар успешно создан');
    } catch (e) {
      bus.emit('banner:error', e.message || 'Ошибка при создании товара');
    }
  });

  // Обновление товара
  bus.on('product:update', (data) => {
    try {
      update(data.id, data);
      refreshList();
      form.clear();
      bus.emit('banner:info', 'Товар успешно обновлён');
    } catch (e) {
      bus.emit('banner:error', e.message || 'Ошибка при обновлении товара');
    }
  });

  // Запрос на редактирование — просто заполняем форму
  bus.on('product:editRequest', (id) => {
    const product = getById(id);
    if (!product) {
      bus.emit('banner:error', 'Товар не найден');
      return;
    }
    form.fill(product);
    bus.emit('banner:info', 'Режим редактирования товара');
  });

  // Удаление товара
  bus.on('product:deleteRequest', (id) => {
    try {
      remove(id);
      refreshList();
      bus.emit('banner:info', 'Товар удалён');
    } catch (e) {
      bus.emit('banner:error', e.message || 'Ошибка при удалении товара');
    }
  });

  // первый рендер списка
  refreshList();
}

document.addEventListener('DOMContentLoaded', init);
