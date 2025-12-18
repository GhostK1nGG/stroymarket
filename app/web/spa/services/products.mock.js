// Стартовые "моковые" данные — то, что есть при загрузке страницы
const initialProducts = [
  { id: 1, name: 'Цемент М500', sku: 'CEM-500', price: 350 },
  { id: 2, name: 'Кирпич красный', sku: 'BRICK-RED', price: 15 },
  { id: 3, name: 'Песок карьерный', sku: 'SAND-01', price: 200 },
];

export class MockProductService {
  constructor(seed = initialProducts) {
    this.initialProducts = seed;
    this.reset();
  }

  reset() {
    this.products = [...this.initialProducts];
  }

  getAll() {
    return this.products;
  }

  getById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Товар не найден');
    }
    return product;
  }

  create(data) {
    const maxId = this.products.length ? Math.max(...this.products.map((p) => p.id)) : 0;
    const id = maxId + 1;

    const product = {
      id,
      name: data.name,
      sku: data.sku,
      price: Number(data.price),
    };

    this.products.push(product);
    return product;
  }

  update(id, data) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Товар не найден');
    }

    this.products[index] = {
      ...this.products[index],
      name: data.name,
      sku: data.sku,
      price: Number(data.price),
    };

    return this.products[index];
  }

  remove(id) {
    const before = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);

    if (this.products.length === before) {
      throw new Error('Товар не найден');
    }
  }
}
