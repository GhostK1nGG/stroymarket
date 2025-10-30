window.SPA_Details = (function() {
  const detailsEl = () => document.getElementById('details-content')

  function render(item) {
    const el = detailsEl()
    if (!item) {
      el.className = 'details-empty'
      el.textContent = 'Выберите товар слева.'
      return
    }
    el.className = 'details-item'
    el.innerHTML = `
      <div><strong>ID:</strong> ${item.id}</div>
      <div><strong>Название:</strong> ${item.name}</div>
      <div><strong>Цена:</strong> ${item.price} ₽</div>
      <div><strong>Категория:</strong> ${item.category || '—'}</div>
      <div><strong>Описание:</strong><br>${item.description || '—'}</div>
    `
  }

  return { render }
})()
