import { useAppContext } from '../../contexts/AppContext';

type MenuProps = {
  activeTab: string;
  onSelect: (tab: string) => void;
};

const Menu = ({ activeTab, onSelect }: MenuProps) => {
  const { t } = useAppContext();

  return (
    <nav className="menu">
      {[
        { key: 'login', label: t.login },
        { key: 'users', label: t.users },
        { key: 'factures', label: t.invoices },
      ].map((item) => (
        <button
          key={item.key}
          className={activeTab === item.key ? 'active' : ''}
          onClick={() => onSelect(item.key)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default Menu;
