import { ProductList } from './ProductList.js';
import { ProductForm } from './ProductForm.js';
import { Banner } from './Banner.js';

export class App {
  constructor({ listRoot, formElement, bannerRoot, totalCountEl, service, bus }) {
    this.service = service;
    this.bus = bus;

    this.list = new ProductList(listRoot);
    this.form = new ProductForm(formElement);
    this.banner = new Banner(bannerRoot);
    this.totalCountEl = totalCountEl;

    this.bindEvents();
  }

  async init() {
    await this.refreshList();
  }

  bindEvents() {
    // Создание товара
    this.bus.on('product:create', async (data) => {
      try {
        await this.service.create(data);
        await this.refreshList();
        this.form.clear();
        this.bus.emit('banner:info', 'Товар успешно создан');
      } catch (e) {
        this.bus.emit('banner:error', e.message || 'Ошибка при создании товара');
      }
    });

    // Обновление товара
    this.bus.on('product:update', async (data) => {
      try {
        await this.service.update(data.id, data);
        await this.refreshList();
        this.form.clear();
        this.bus.emit('banner:info', 'Товар успешно обновлён');
      } catch (e) {
        this.bus.emit('banner:error', e.message || 'Ошибка при обновлении товара');
      }
    });

    // Запрос на редактирование — заполняем форму
    this.bus.on('product:editRequest', async (id) => {
      try {
        const product = await this.service.getById(id);
        this.form.fill(product);
        this.bus.emit('banner:info', 'Режим редактирования товара');
      } catch (e) {
        this.bus.emit('banner:error', e.message || 'Товар не найден');
      }
    });

    // Удаление товара
    this.bus.on('product:deleteRequest', async (id) => {
      try {
        await this.service.remove(id);
        await this.refreshList();
        this.bus.emit('banner:info', 'Товар удалён');
      } catch (e) {
        this.bus.emit('banner:error', e.message || 'Ошибка при удалении товара');
      }
    });
  }

  async refreshList() {
    const items = await this.service.getAll();
    this.list.render(items);
    this.totalCountEl.textContent = String(items.length);
    this.bus.emit('banner:clear');
  }
}
