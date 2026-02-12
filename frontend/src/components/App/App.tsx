import { useState } from 'react';
import Menu from '../Menu/Menu';
import Login from '../Login/Login';
import UserList from '../UserList/UserList';
import Factures from '../Factures/Factures';
import { useAppContext } from '../../contexts/AppContext';

const App = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { t } = useAppContext();

  return (
    <main className="app-shell">
      <header>
        <h1>{t.appTitle}</h1>
        <p>{t.welcome}</p>
      </header>

      <Menu activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === 'login' && <Login />}
      {activeTab === 'users' && <UserList />}
      {activeTab === 'factures' && <Factures />}
    </main>
  );
};

export default App;
