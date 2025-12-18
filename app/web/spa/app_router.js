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
