// app/web/spa/form.js
window.SPA_Form = (function () {
  const form = () => document.getElementById('item-form');
  const title = () => document.getElementById('form-title');
  const idEl = () => document.getElementById('item-id');
  const nameEl = () => document.getElementById('item-name');
  const skuEl = () => document.getElementById('item-sku');
  const priceEl = () => document.getElementById('item-price');
  const catEl = () => document.getElementById('item-category');
  const descEl = () => document.getElementById('item-description');
  const resetBtn = () => document.getElementById('reset-btn');
  const saveBtn = () => document.getElementById('save-btn');
  const errBox = () => document.getElementById('form-error');

  let onSubmitCb = null;

  function showError(msg) {
    if (!errBox()) return;
    errBox().textContent = msg;
    errBox().style.display = 'block';
  }

  function clearError() {
    if (!errBox()) return;
    errBox().textContent = '';
    errBox().style.display = 'none';
  }

  function fill(item) {
    title().textContent = 'Редактирование товара';
    saveBtn().textContent = 'Сохранить';

    idEl().value = item.id;
    nameEl().value = item.name || '';
    skuEl().value = item.sku || '';
    priceEl().value = item.price || '';
    catEl().value = item.category || '';
    descEl().value = item.description || '';

    clearError();
  }

  function clear() {
    title().textContent = 'Создание товара';
    saveBtn().textContent = 'Создать';

    form().reset();
    idEl().value = '';
    clearError();
  }

  function init(onSubmit) {
    onSubmitCb = onSubmit;

    form().addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameEl().value.trim();
      const sku = skuEl().value.trim();
      const price = Number(priceEl().value);

      if (!name || !sku || isNaN(price)) {
        showError('Заполните «Название», «Артикул (sku)» и корректную «Цену»');
        return;
      }

      const data = {
        id: idEl().value ? Number(idEl().value) : null,
        name: name,
        sku: sku,
        price: price,
        category: catEl().value.trim(),
        description: descEl().value.trim(),
      };

      clearError();
      if (onSubmitCb) {
        onSubmitCb(data);
      }
    });

    resetBtn().addEventListener('click', () => {
      clear();
    });
  }

  return { init, fill, clear };
})();
