const React = window.React;
const { useEffect, useRef, useState } = React;

export function ChatPage() {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Соединяемся с сервером...');

  useEffect(() => {
    const conn = new WebSocket('ws://localhost:8080');
    socketRef.current = conn;

    conn.onopen = () => {
      setStatus('Соединение установлено');
    };

    conn.onclose = () => {
      setStatus('Соединение закрыто');
    };

    conn.onerror = (e) => {
      console.error('WebSocket error', e);
      setStatus('Ошибка соединения');
    };

    conn.onmessage = (event) => {
      const data = event.data;
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.user && parsed.text) {
          setMessages((prev) => [...prev, `${parsed.user}: ${parsed.text}`]);
        } else {
          setMessages((prev) => [...prev, data]);
        }
      } catch {
        setMessages((prev) => [...prev, data]);
      }
    };

    return () => {
      conn.close();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const payload = JSON.stringify({ user: name || 'Гость', text: text.trim() });
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(payload);
      setMessages((prev) => [...prev, `Вы: ${text.trim()}`]);
      setText('');
    }
  };

  return React.createElement(
    'div',
    { className: 'page__content' },
    React.createElement('h1', null, 'Чат (ЛР6)'),
    React.createElement('p', null, status),
    React.createElement(
      'div',
      { className: 'chat' },
      [
        React.createElement(
          'div',
          { key: 'messages', className: 'chat__messages' },
          messages.length === 0
            ? React.createElement('p', null, 'Сообщений пока нет')
            : messages.map((msg, idx) => React.createElement('div', { key: idx, className: 'chat__message' }, msg))
        ),
        React.createElement(
          'form',
          { key: 'form', className: 'chat__form', onSubmit: handleSubmit },
          [
            React.createElement(
              'label',
              { key: 'name', className: 'field' },
              React.createElement('span', null, 'Имя'),
              React.createElement('input', {
                type: 'text',
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: 'Ваше имя',
              })
            ),
            React.createElement(
              'label',
              { key: 'text', className: 'field' },
              React.createElement('span', null, 'Сообщение'),
              React.createElement('textarea', {
                value: text,
                onChange: (e) => setText(e.target.value),
                rows: 3,
                placeholder: 'Напишите сообщение и нажмите Enter или Отправить',
              })
            ),
            React.createElement(
              'div',
              { key: 'actions', className: 'form-buttons' },
              React.createElement('button', { type: 'submit' }, 'Отправить')
            ),
          ]
        ),
      ]
    )
  );
}
