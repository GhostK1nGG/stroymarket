// services/products.api.js
// Работа с реальным API Yii2 по адресу /products

const BASE_URL = '/products';

// Вспомогательная функция: обработка ответа и сбор сообщения об ошибке
async function handleResponse(res) {
  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      // если это не JSON – оставим как есть
    }
  }

  if (!res.ok) {
    // Пытаемся достать нормальное сообщение
    let message = `Ошибка запроса (${res.status})`;

    // Вариант, когда Yii2 вернул errors из валидации:
    // { "errors": { "sku": ["SKU уже существует"], "name": ["Обязательное поле"] } }
    if (data && data.errors) {
      const parts = [];
      for (const [field, messages] of Object.entries(data.errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
          parts.push(`${field}: ${messages.join(', ')}`);
        }
      }
      if (parts.length) {
        message = parts.join(' | ');
      }
    } else if (data && data.message) {
      // Например, 404 с текстом
      message = data.message;
    }

    throw new Error(message);
  }

  return data;
}

export class ProductApiService {
  // GET /products – список товаров
  async getAll() {
    const res = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    return handleResponse(res); // вернёт массив продуктов
  }

  // GET /products/{id} – один товар
  async getById(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    return handleResponse(res); // вернёт один продукт
  }

  // POST /products – создать (FormData, как в ЛР1)
  async create(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('sku', data.sku);
    formData.append('price', String(data.price));
    // при желании можно добавить category/description, если добавишь в модель

    const res = await fetch(BASE_URL, {
      method: 'POST',
      body: formData,
    });

    return handleResponse(res); // вернёт созданный продукт
  }

  // PUT /products/{id} – полное обновление (JSON)
  async update(id, data) {
    const payload = {
      name: data.name,
      sku: data.sku,
      price: Number(data.price),
    };

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse(res); // вернёт обновлённый продукт
  }

  // DELETE /products/{id} – удаление
  async remove(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    // нам неважно, что там вернётся, главное – без ошибки
    await handleResponse(res);
  }
}
