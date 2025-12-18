import { Layout } from './components/Layout.js';
import { ProductsPage } from './components/ProductsPageApi.js';
import { ChatPage } from './components/ChatPage.js';

const React = window.React;

function createRouterShim() {
  const RouterContext = React.createContext({
    location: window.location.pathname,
    navigate: () => {},
    outlet: null,
  });

  const createBrowserRouter = (routes) => ({ routes });

  const Outlet = () => {
    const ctx = React.useContext(RouterContext);
    return ctx.outlet ?? null;
  };

  const Link = ({ to, className, children, onClick }) => {
    const ctx = React.useContext(RouterContext);
    return React.createElement(
      'a',
      {
        href: to,
        className,
        onClick: (evt) => {
          evt.preventDefault();
          onClick?.(evt);
          ctx.navigate?.(to);
        },
      },
      children
    );
  };

  const NavLink = ({ to, className, children, end }) => {
    const ctx = React.useContext(RouterContext);
    const isActive = end ? ctx.location === to : ctx.location.startsWith(to);
    const resolvedClass =
      typeof className === 'function' ? className({ isActive }) : className ?? '';
    return React.createElement(Link, { to, className: resolvedClass }, children);
  };

  const RouterProvider = ({ router }) => {
    const [location, setLocation] = React.useState(window.location.pathname);

    React.useEffect(() => {
      const handlePop = () => setLocation(window.location.pathname);
      window.addEventListener('popstate', handlePop);
      return () => window.removeEventListener('popstate', handlePop);
    }, []);

    const navigate = (to) => {
      if (to === location) return;
      window.history.pushState({}, '', to);
      setLocation(to);
    };

    const matchRoutes = () => {
      const root = router.routes?.[0];
      if (!root) return { outlet: null };
      const child =
        root.children?.find((route) => route.path === location) ||
        root.children?.find((route) => route.path === '/');
      return { outlet: child?.element ?? null, layout: root.element };
    };

    const match = matchRoutes();
    const contextValue = { location, navigate, outlet: match.outlet };

    return React.createElement(
      RouterContext.Provider,
      { value: contextValue },
      match.layout
    );
  };

  return { createBrowserRouter, RouterProvider, NavLink, Outlet };
}

if (!window.ReactRouterDOM) {
  window.ReactRouterDOM = createRouterShim();
}

const router = window.ReactRouterDOM.createBrowserRouter([
  {
    path: '/',
    element: React.createElement(Layout),
    children: [
      {
        path: '/',
        element: React.createElement(ProductsPage),
      },
      {
        path: '/chat',
        element: React.createElement(ChatPage),
      },
    ],
  },
]);

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(window.ReactRouterDOM.RouterProvider, { router }));
