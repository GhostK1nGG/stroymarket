import { bus } from '../state/bus.js';

export class ProductForm {
  constructor(formElement) {
    this.formElement = formElement;

    this.idField = formElement.querySelector('#field-id');
    this.nameField = formElement.querySelector('#field-name');
    this.skuField = formElement.querySelector('#field-sku');
    this.priceField = formElement.querySelector('#field-price');

    this.bindEvents();
  }

  bindEvents() {
    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = this.collectData();
      const error = this.validate(data);

      if (error) {
        bus.emit('banner:error', error);
        return;
      }

      if (data.id) {
        bus.emit('product:update', data);
      } else {
        bus.emit('product:create', data);
      }
    });

    this.formElement.addEventListener('reset', () => {
      this.clear();
      bus.emit('banner:clear');
    });
  }

  collectData() {
    return {
      id: this.idField.value ? Number(this.idField.value) : null,
      name: this.nameField.value.trim(),
      sku: this.skuField.value.trim(),
      price: this.priceField.value.trim(),
    };
  }

  validate(data) {
    if (!data.name) {
      return 'Поле "Название" обязательно';
    }
    if (!data.sku) {
      return 'Поле "SKU" обязательно';
    }
    if (!data.price) {
      return 'Поле "Цена" обязательно';
    }

    const priceNum = Number(data.price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      return 'Цена должна быть положительным числом';
    }

    return null;
  }

  fill(product) {
    this.idField.value = product.id;
    this.nameField.value = product.name;
    this.skuField.value = product.sku;
    this.priceField.value = product.price;
  }

  clear() {
    this.idField.value = '';
    this.nameField.value = '';
    this.skuField.value = '';
    this.priceField.value = '';
  }
}
