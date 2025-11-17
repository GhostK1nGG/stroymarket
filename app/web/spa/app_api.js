// app_api.js — ЛР3: SPA, работающая с реальным API Yii2

import { bus } from './state/bus.js';
import { getAll, getById, create, update, remove } from './services/products.api.js';
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
  const banner = new Banner(bannerRoot);

  // Асинхронная перерисовка списка с API
  async function refreshList() {
    try {
      const items = await getAll();
      list.render(items);
      totalCountEl.textContent = String(items.length);
      bus.emit('banner:clear');
    } catch (e) {
      console.error(e);
      bus.emit('banner:error', e.message || 'Ошибка загрузки списка товаров');
    }
  }

  // Создание товара через API
  bus.on('product:create', async (data) => {
    try {
      await create(data);
      await refreshList();
      form.clear();
      bus.emit('banner:info', 'Товар успешно создан');
    } catch (e) {
      console.error(e);
      // ВАЖНО ДЛЯ ЛР3: показываем текст ошибки с бэка
      bus.emit('banner:error', e.message || 'Ошибка при создании товара');
    }
  });

  // Обновление товара через API
  bus.on('product:update', async (data) => {
    try {
      await update(data.id, data);
      await refreshList();
      form.clear();
      bus.emit('banner:info', 'Товар успешно обновлён');
    } catch (e) {
      console.error(e);
      bus.emit('banner:error', e.message || 'Ошибка при обновлении товара');
    }
  });

  // Запрос на редактирование (подтягиваем данные с сервера по id)
  bus.on('product:editRequest', async (id) => {
    try {
      const product = await getById(id);
      form.fill(product);
      bus.emit('banner:info', 'Режим редактирования товара');
    } catch (e) {
      console.error(e);
      bus.emit('banner:error', e.message || 'Товар не найден');
    }
  });

  // Удаление через API
  bus.on('product:deleteRequest', async (id) => {
    try {
      await remove(id);
      await refreshList();
      bus.emit('banner:info', 'Товар удалён');
    } catch (e) {
      console.error(e);
      bus.emit('banner:error', e.message || 'Ошибка при удалении товара');
    }
  });

  // Первичная загрузка списка с сервера
  refreshList();
}

document.addEventListener('DOMContentLoaded', init);
