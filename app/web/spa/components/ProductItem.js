import { bus } from '../state/bus.js';

export class ProductItem {
  constructor(product) {
    this.product = product;
  }

  render() {
    const li = document.createElement('li');
    li.className = 'product-item';

    const main = document.createElement('div');
    main.className = 'product-item__main';

    const name = document.createElement('span');
    name.className = 'product-item__name';
    name.textContent = this.product.name;

    const sku = document.createElement('span');
    sku.className = 'product-item__sku';
    sku.textContent = `SKU: ${this.product.sku}`;

    const price = document.createElement('span');
    price.className = 'product-item__price';
    price.textContent = `Цена: ${this.product.price} ₽`;

    main.appendChild(name);
    main.appendChild(sku);
    main.appendChild(price);

    const actions = document.createElement('div');
    actions.className = 'product-item__actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Редактировать';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = '✕';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(main);
    li.appendChild(actions);

    // Клик по карточке — просто "выбрали товар" (если захочешь делать детальный просмотр)
    li.addEventListener('click', (e) => {
      if (e.target === editBtn || e.target === deleteBtn) return;
      bus.emit('product:select', this.product.id);
    });

    // Кнопка "редактировать" — просим заполнить форму
    editBtn.addEventListener('click', () => {
      bus.emit('product:editRequest', this.product.id);
    });

    // Кнопка "удалить"
    deleteBtn.addEventListener('click', () => {
      bus.emit('product:deleteRequest', this.product.id);
    });

    return li;
  }
}
