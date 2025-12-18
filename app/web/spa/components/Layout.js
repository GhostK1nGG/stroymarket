import React from 'https://esm.sh/react@18.2.0';
import { NavLink, Outlet } from 'https://esm.sh/react-router-dom@6.22.3';

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
