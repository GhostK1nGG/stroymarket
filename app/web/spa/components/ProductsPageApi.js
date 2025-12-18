const React = window.React;
const { useEffect, useMemo, useState } = React;

import { ProductApiService } from '../services/products.api.js';

export function ProductsPage() {
  const service = useMemo(() => new ProductApiService(), []);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', sku: '', price: '' });
  const [banner, setBanner] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await service.getAll();
        if (active) {
          setItems(data || []);
        }
      } catch (e) {
        if (active) setError(e.message || 'Не удалось загрузить список');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [service]);

  const resetForm = () => {
    setFormData({ id: '', name: '', sku: '', price: '' });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setBanner('');
    setError('');

    const payload = {
      id: formData.id,
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      price: formData.price,
    };

    if (!payload.name || !payload.sku || payload.price === '') {
      setError('Заполните все обязательные поля');
      return;
    }

    try {
      if (payload.id) {
        const updated = await service.update(payload.id, payload);
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setBanner('Товар обновлён');
      } else {
        const created = await service.create(payload);
        setItems((prev) => [...prev, created]);
        setBanner('Товар создан');
      }
      resetForm();
    } catch (e) {
      setError(e.message || 'Ошибка при сохранении товара');
    }
  };

  const handleEdit = (item) => {
    setFormData({ id: item.id, name: item.name || '', sku: item.sku || '', price: item.price ?? '' });
    setBanner('Режим редактирования');
    setError('');
  };

  const handleDelete = async (id) => {
    setBanner('');
    setError('');
    try {
      await service.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setBanner('Товар удалён');
      if (formData.id === id) {
        resetForm();
      }
    } catch (e) {
      setError(e.message || 'Ошибка при удалении товара');
    }
  };

  return React.createElement(
    'div',
    { className: 'page__content' },
    React.createElement('h1', null, 'Управление товарами (ЛР6, API)'),
    banner && React.createElement('div', { className: 'banner' }, banner),
    error && React.createElement('div', { className: 'banner banner--error' }, error),
    loading
      ? React.createElement('p', null, 'Загрузка...')
      : React.createElement(
          'div',
          { className: 'layout' },
          React.createElement(
            'section',
            { className: 'card' },
            React.createElement(
              'h2',
              null,
              'Товары (',
              React.createElement('span', null, items.length),
              ')'
            ),
            React.createElement(
              'ul',
              { className: 'items-list' },
              items.length === 0
                ? React.createElement('p', null, 'Товаров пока нет')
                : items.map((item) =>
                    React.createElement(
                      'li',
                      { key: item.id, className: 'item' },
                      React.createElement('div', { className: 'item__main' }, [
                        React.createElement('strong', { key: 'name' }, item.name),
                        React.createElement('span', { key: 'sku', className: 'item__sku' }, 'SKU: ', item.sku),
                        React.createElement('span', { key: 'price', className: 'item__price' }, 'Цена: ', item.price),
                      ]),
                      React.createElement(
                        'div',
                        { className: 'item__actions' },
                        [
                          React.createElement(
                            'button',
                            { key: 'edit', type: 'button', onClick: () => handleEdit(item) },
                            'Редактировать'
                          ),
                          React.createElement(
                            'button',
                            {
                              key: 'delete',
                              type: 'button',
                              onClick: () => handleDelete(item.id),
                              className: 'danger',
                            },
                            'Удалить'
                          ),
                        ]
                      )
                    )
                  )
            )
          ),
          React.createElement(
            'section',
            { className: 'card' },
            React.createElement('h2', null, 'Форма товара'),
            React.createElement(
              'form',
              {
                className: 'item-form',
                onSubmit: handleSubmit,
                onReset: (evt) => {
                  evt.preventDefault();
                  resetForm();
                },
              },
              [
                React.createElement('input', {
                  key: 'id',
                  type: 'hidden',
                  value: formData.id,
                  readOnly: true,
                }),
                React.createElement(
                  'label',
                  { key: 'name', className: 'field' },
                  React.createElement('span', null, 'Название *'),
                  React.createElement('input', {
                    value: formData.name,
                    onChange: (e) => setFormData((prev) => ({ ...prev, name: e.target.value })),
                    type: 'text',
                  })
                ),
                React.createElement(
                  'label',
                  { key: 'sku', className: 'field' },
                  React.createElement('span', null, 'Артикул (SKU) *'),
                  React.createElement('input', {
                    value: formData.sku,
                    onChange: (e) => setFormData((prev) => ({ ...prev, sku: e.target.value })),
                    type: 'text',
                  })
                ),
                React.createElement(
                  'label',
                  { key: 'price', className: 'field' },
                  React.createElement('span', null, 'Цена *'),
                  React.createElement('input', {
                    value: formData.price,
                    onChange: (e) => setFormData((prev) => ({ ...prev, price: e.target.value })),
                    type: 'number',
                    step: '0.01',
                  })
                ),
                React.createElement(
                  'div',
                  { key: 'buttons', className: 'form-buttons' },
                  [
                    React.createElement('button', { key: 'submit', type: 'submit' }, 'Сохранить'),
                    React.createElement('button', { key: 'reset', type: 'reset' }, 'Очистить форму'),
                  ]
                ),
              ]
            )
          )
        )
  );
}
