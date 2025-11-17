// Стартовые "моковые" данные — то, что есть при загрузке страницы
const initialProducts = [
  { id: 1, name: 'Цемент М500', sku: 'CEM-500', price: 350 },
  { id: 2, name: 'Кирпич красный', sku: 'BRICK-RED', price: 15 },
  { id: 3, name: 'Песок карьерный', sku: 'SAND-01', price: 200 },
];

// "Текущие" данные в ОЗУ — с ними и работаем
let products = [...initialProducts];

export function getAll() {
  return products;
}

export function getById(id) {
  return products.find((p) => p.id === id) || null;
}

export function create(data) {
  const maxId = products.length ? Math.max(...products.map((p) => p.id)) : 0;
  const id = maxId + 1;

  const product = {
    id,
    name: data.name,
    sku: data.sku,
    price: Number(data.price),
  };

  products.push(product);
  return product;
}

export function update(id, data) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Товар не найден');
  }

  products[index] = {
    ...products[index],
    name: data.name,
    sku: data.sku,
    price: Number(data.price),
  };

  return products[index];
}

export function remove(id) {
  const before = products.length;
  products = products.filter((p) => p.id !== id);

  if (products.length === before) {
    throw new Error('Товар не найден');
  }
}
