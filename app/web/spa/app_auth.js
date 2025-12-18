const React = window.React;
const { useEffect, useState } = React;

const API_BASE = '';

const getToken = () => localStorage.getItem('authToken') || '';
const saveToken = (token) => localStorage.setItem('authToken', token);
const clearToken = () => localStorage.removeItem('authToken');

async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  let payload = body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error('Request failed');
    error.data = data;
    error.status = res.status;
    throw error;
  }
  return data;
}

function AuthForms({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');

  const submit = async (evt) => {
    evt.preventDefault();
    setError('');
    try {
      const path = mode === 'register' ? '/auth/register' : '/auth/login';
      const payload = mode === 'register'
        ? { email, password, password_repeat: repeat }
        : { email, password };
      const result = await apiRequest(path, { method: 'POST', body: payload });
      onAuth(result);
      setEmail('');
      setPassword('');
      setRepeat('');
    } catch (e) {
      if (e.data?.error) {
        setError(e.data.error);
      } else if (e.data?.errors) {
        const first = Object.values(e.data.errors).flat()[0];
        setError(first || 'Ошибка запроса');
      } else {
        setError('Ошибка запроса');
      }
    }
  };

  return React.createElement(
    'div',
    { className: 'auth-panel' },
    React.createElement('h2', null, mode === 'register' ? 'Регистрация' : 'Авторизация'),
    error ? React.createElement('div', { className: 'error' }, error) : null,
    React.createElement(
      'form',
      { onSubmit: submit, className: 'form-grid' },
      React.createElement(
        'label',
        null,
        'Email',
        React.createElement('input', {
          type: 'email',
          required: true,
          value: email,
          onChange: (e) => setEmail(e.target.value),
        })
      ),
      React.createElement(
        'label',
        null,
        'Пароль',
        React.createElement('input', {
          type: 'password',
          required: true,
          value: password,
          onChange: (e) => setPassword(e.target.value),
        })
      ),
      mode === 'register'
        ? React.createElement(
            'label',
            null,
            'Повтор пароля',
            React.createElement('input', {
              type: 'password',
              required: true,
              value: repeat,
              onChange: (e) => setRepeat(e.target.value),
            })
          )
        : null,
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('button', { type: 'submit' }, 'Отправить'),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => setMode(mode === 'register' ? 'login' : 'register'),
          },
          mode === 'register' ? 'У меня уже есть аккаунт' : 'Хочу зарегистрироваться'
        )
      )
    )
  );
}

function ProductForm({ onSubmit, initial }) {
  const [sku, setSku] = useState(initial?.sku || '');
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price ?? '');
  const [quantity, setQuantity] = useState(initial?.quantity ?? '');

  useEffect(() => {
    setSku(initial?.sku || '');
    setName(initial?.name || '');
    setPrice(initial?.price ?? '');
    setQuantity(initial?.quantity ?? '');
  }, [initial]);

  const submit = (evt) => {
    evt.preventDefault();
    onSubmit({ sku, name, price: Number(price), quantity: Number(quantity) });
  };

  return React.createElement(
    'form',
    { onSubmit: submit, className: 'form-grid' },
    React.createElement(
      'label',
      null,
      'SKU',
      React.createElement('input', {
        required: true,
        value: sku,
        onChange: (e) => setSku(e.target.value),
      })
    ),
    React.createElement(
      'label',
      null,
      'Название',
      React.createElement('input', {
        required: true,
        value: name,
        onChange: (e) => setName(e.target.value),
      })
    ),
    React.createElement(
      'label',
      null,
      'Цена',
      React.createElement('input', {
        type: 'number',
        min: 0,
        step: '0.01',
        required: true,
        value: price,
        onChange: (e) => setPrice(e.target.value),
      })
    ),
    React.createElement(
      'label',
      null,
      'Количество',
      React.createElement('input', {
        type: 'number',
        min: 0,
        required: true,
        value: quantity,
        onChange: (e) => setQuantity(e.target.value),
      })
    ),
    React.createElement('button', { type: 'submit' }, 'Сохранить')
  );
}

function ProductsSecure({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/secure-products', { token });
      setItems(data);
    } catch (e) {
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      load();
    }
  }, [token]);

  const handleCreate = async (payload) => {
    setError('');
    try {
      const created = await apiRequest('/secure-products', { method: 'POST', token, body: payload });
      setItems((prev) => [...prev, created]);
      setEditing(null);
    } catch (e) {
      setError(e.data?.errors ? JSON.stringify(e.data.errors) : 'Ошибка сохранения');
    }
  };

  const handleUpdate = async (id, payload) => {
    setError('');
    try {
      const updated = await apiRequest(`/secure-products/${id}`, { method: 'PUT', token, body: payload });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setEditing(null);
    } catch (e) {
      setError(e.data?.errors ? JSON.stringify(e.data.errors) : 'Ошибка обновления');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await apiRequest(`/secure-products/${id}`, { method: 'DELETE', token });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError('Не удалось удалить');
    }
  };

  return React.createElement(
    'div',
    { className: 'panel' },
    React.createElement('h2', null, 'Ваши товары (требуется токен)'),
    error ? React.createElement('div', { className: 'error' }, error) : null,
    loading
      ? React.createElement('p', null, 'Загрузка...')
      : React.createElement(
          React.Fragment,
          null,
          React.createElement('h3', null, editing ? 'Редактирование' : 'Создание'),
          React.createElement(ProductForm, {
            initial: editing,
            onSubmit: (payload) => {
              if (editing) {
                handleUpdate(editing.id, payload);
              } else {
                handleCreate(payload);
              }
            },
          }),
          React.createElement(
            'div',
            { className: 'table' },
            React.createElement(
              'div',
              { className: 'table-row header' },
              React.createElement('div', null, 'SKU'),
              React.createElement('div', null, 'Название'),
              React.createElement('div', null, 'Цена'),
              React.createElement('div', null, 'Кол-во'),
              React.createElement('div', null, 'Действия')
            ),
            items.map((item) =>
              React.createElement(
                'div',
                { key: item.id, className: 'table-row' },
                React.createElement('div', null, item.sku),
                React.createElement('div', null, item.name),
                React.createElement('div', null, item.price),
                React.createElement('div', null, item.quantity),
                React.createElement(
                  'div',
                  { className: 'row gap' },
                  React.createElement(
                    'button',
                    { type: 'button', onClick: () => setEditing(item) },
                    'Редактировать'
                  ),
                  React.createElement(
                    'button',
                    { type: 'button', onClick: () => handleDelete(item.id) },
                    'Удалить'
                  )
                )
              )
            )
          )
        )
  );
}

function AuthApp() {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);

  const handleAuth = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    saveToken(payload.token);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    clearToken();
  };

  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement('h1', null, 'ЛР 2.8: Авторизация + товары'),
    token
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'div',
            { className: 'row space-between' },
            React.createElement('div', null, `Токен: ${token}`),
            React.createElement('button', { type: 'button', onClick: logout }, 'Выйти')
          ),
          React.createElement(ProductsSecure, { token })
        )
      : React.createElement(AuthForms, { onAuth: handleAuth })
  );
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(AuthApp));
