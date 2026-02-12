import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="layout">
      <header className="layout__header">
        <nav>Mon Application</nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
      <footer className="layout__footer">
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;

