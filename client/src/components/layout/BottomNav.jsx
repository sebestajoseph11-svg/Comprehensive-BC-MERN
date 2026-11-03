import { NavLink } from 'react-router-dom';
import { bottomNav } from '../../config/navigation';
import { useUi } from '../../store/UiProvider';
import Icon from '../icons/Icon';

export default function BottomNav() {
  const { drawerOpen, setDrawerOpen } = useUi();

  return (
    <nav className="bottom-nav" aria-label="Mobile">
      {bottomNav.map((item) => {
        if (item.action === 'drawer') {
          return (
            <button key={item.id} type="button" className={`bottom-item ${drawerOpen ? 'active' : ''}`} onClick={() => setDrawerOpen(true)}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          );
        }
        return (
          <NavLink key={item.id} to={item.path} end={item.path === '/'} className={({ isActive }) => `bottom-item ${isActive ? 'active' : ''}`}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
