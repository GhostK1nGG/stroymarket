const React = window.React;
const { NavLink, Outlet } = window.ReactRouterDOM;

export function Layout() {
  return React.createElement(
    'div',
    { className: 'layout-shell' },
    React.createElement(
      'nav',
      { className: 'nav' },
      [
        React.createElement(
          NavLink,
          {
            key: 'products',
            to: '/',
            className: ({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`,
            end: true,
          },
          'Товары'
        ),
        React.createElement(
          NavLink,
          {
            key: 'chat',
            to: '/chat',
            className: ({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`,
          },
          'Чат'
        ),
      ]
    ),
    React.createElement('main', { className: 'page' }, React.createElement(Outlet))
  );
}
