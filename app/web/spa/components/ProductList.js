import { ProductItem } from './ProductItem.js';

export class ProductList {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(items) {
    this.rootElement.innerHTML = '';

    if (!items.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Товаров пока нет';
      this.rootElement.appendChild(empty);
      return;
    }

    items.forEach((product) => {
      const item = new ProductItem(product);
      this.rootElement.appendChild(item.render());
    });
  }
}
