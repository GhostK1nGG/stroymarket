
import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import { createBrowserRouter, RouterProvider } from 'https://esm.sh/react-router-dom@6.22.3';
import { Layout } from './components/Layout.js';
import { ProductsPage } from './components/ProductsPageApi.js';
import { ChatPage } from './components/ChatPage.js';

const router = window.ReactRouterDOM.createBrowserRouter([
  {
    path: '/',
    element: window.React.createElement(Layout),
    children: [
      {
        path: '/',
        element: window.React.createElement(ProductsPage),
      },
      {
        path: '/chat',
        element: window.React.createElement(ChatPage),
      },
    ],
  },
]);

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(window.React.createElement(window.ReactRouterDOM.RouterProvider, { router }));

