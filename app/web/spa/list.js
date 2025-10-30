window.SPA_List = (function() {
  const listEl = () => document.getElementById('items-list')
  const totalEl = () => document.getElementById('total-count')

  function render(items, selectedId, { onSelect, onEdit, onDelete }) {
    const el = listEl()
    el.innerHTML = ''
    totalEl().textContent = items.length + ' шт.'

    if (!items.length) {
      el.innerHTML = '<div class="item-row">Нет товаров</div>'
      return
    }

    items.forEach(item => {
      const row = document.createElement('div')
      row.className = 'item-row' + (item.id === selectedId ? ' selected' : '')

      const main = document.createElement('div')
      main.className = 'item-main'
      main.innerHTML = `
        <div class="item-name">${item.name}</div>
        <div class="item-meta">${item.price} ₽ • ${item.category || 'без категории'}</div>
      `
      main.addEventListener('click', () => onSelect && onSelect(item.id))

      const actions = document.createElement('div')
      actions.className = 'row-actions'

      const editBtn = document.createElement('button')
      editBtn.className = 'btn ghost'
      editBtn.textContent = 'ред.'
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        onEdit && onEdit(item)
      })

      const delBtn = document.createElement('button')
      delBtn.className = 'btn danger'
      delBtn.textContent = '✕'
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        onDelete && onDelete(item.id)
      })

      actions.appendChild(editBtn)
      actions.appendChild(delBtn)

      row.appendChild(main)
      row.appendChild(actions)
      el.appendChild(row)
    })
  }

  return { render }
})()
