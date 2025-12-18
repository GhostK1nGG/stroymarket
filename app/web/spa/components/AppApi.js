import { ProductList } from './ProductList.js';
import { ProductForm } from './ProductForm.js';
import { Banner } from './Banner.js';

export class AppApi {
  constructor({ listRoot, formElement, bannerRoot, totalCountEl, service, bus }) {
    this.service = service;
    this.bus = bus;
    this.items = [];

    this.list = new ProductList(listRoot);
    this.form = new ProductForm(formElement);
    this.banner = new Banner(bannerRoot);
    this.totalCountEl = totalCountEl;

    this.bindEvents();
  }

  async init() {
    await this.loadAll();
  }

  bindEvents() {
    // Создание товара (POST -> добавить в конец стейта)
    this.bus.on('product:create', async (data) => {
      try {
        const created = await this.service.create(data);
        this.items = [...this.items, created];
        this.render();
        this.form.clear();
        this.bus.emit('banner:info', 'Товар успешно создан');
      } catch (e) {
        this.bus.emit('banner:error', e.message || 'Ошибка при создании товара');
      }
    });

    // Обновление товара (PUT/PATCH -> заменить в стейте по id)
    this.bus.on('product:update', async (data) => {
      try {
        const updated = await this.service.update(data.id, data);
        this.items = this.items.map((item) => (item.id === updated.id ? updated : item));
        this.render();
        this.form.clear();
        this.bus.emit('banner:info', 'Товар успешно обновлён');
      } catch (e) {
        this.bus.emit('banner:error', e.message || 'Ошибка при обновлении товара');
      }
    });

    // Запрос на редактирование — заполняем форму из текущего стейта
    this.bus.on('product:editRequest', (id) => {
      const product = this.items.find((item) => item.id === id);
      if (!product) {
        this.bus.emit('banner:error', 'Товар не найден в списке');
        return;
      }
      this.form.fill(product);
      this.bus.emit('banner:info', 'Режим редактирования товара');
    });

    // Удаление товара (DELETE -> убрать из стейта)
    this.bus.on('product:deleteRequest', async (id) => {
      try {
        await this.service.remove(id);
        this.items = this.items.filter((item) => item.id !== id);
        this.render();
        this.bus.emit('banner:info', 'Товар удалён');
      } catch (e) {
        this.bus.emit('banner:error', e.message || 'Ошибка при удалении товара');
      }
    });
  }

  async loadAll() {
    try {
      this.items = await this.service.getAll();
      this.render();
      this.bus.emit('banner:clear');
    } catch (e) {
      this.bus.emit('banner:error', e.message || 'Не удалось загрузить список товаров');
    }
  }

  render() {
    this.list.render(this.items);
    this.totalCountEl.textContent = String(this.items.length);
  }
}
