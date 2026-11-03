import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { sidebarFooter, sidebarNav, sidebarPromos } from '../../config/navigation';
import { useUi } from '../../store/UiProvider';
import Icon from '../icons/Icon';

function Promo({ item }) {
  if (item.kind === 'token') {
    return (
      <div className={`side-promo ${item.kind}`}>
        <div>
          <strong>{item.title}</strong>
          <div className="token-row">
            <span>{item.price}</span>
            <em>{item.change}</em>
          </div>
        </div>
        <Icon name="chevron" size={16} />
      </div>
    );
  }
  return (
    <div className={`side-promo ${item.kind}`}>
      <div>
        <strong>{item.title}</strong>
        <p>{item.text}</p>
      </div>
      <span className={`promo-art ${item.kind}`} style={{ width: 46, height: 46 }} aria-hidden="true" />
    </div>
  );
}

export default function Sidebar({ variant = 'dock' }) {
  const { pathname } = useLocation();
  const { setDrawerOpen } = useUi();
  const [openId, setOpenId] = useState(null);
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const parent = sidebarNav.find((item) => item.children?.some((child) => child.path === pathname && child.path !== item.path));
    if (parent) setOpenId(parent.id);
  }, [pathname]);

  const onNavigate = () => {
    if (variant === 'drawer') setDrawerOpen(false);
  };

  return (
    <aside className={`sidebar ${variant === 'drawer' ? 'sidebar-drawer' : ''}`}>
      <div className="sidebar-promos">
        {sidebarPromos.map((item) => <Promo key={item.id} item={item} />)}
      </div>
      <nav className="side-nav" aria-label="Main">
        {sidebarNav.map((item) => {
          const childActive = item.children?.some((child) => child.path === pathname);
          const active = pathname === item.path || childActive;
          const opened = openId === item.id;
          if (item.children) {
            return (
              <div key={item.id} className={`nav-group ${opened ? 'open' : ''}`}>
                <button
                  type="button"
                  className={`nav-btn ${active ? 'active' : ''}`}
                  onClick={() => setOpenId(opened ? null : item.id)}
                >
                  <Icon name={item.icon} />
                  <span className="compact-text">{item.label}</span>
                  {item.badge && <em className="nav-badge compact-text">{item.badge}</em>}
                  <span className="nav-caret"><Icon name="down" size={16} /></span>
                </button>
                {opened && (
                  <div className="nav-children compact-text">
                    {item.children.map((child) => (
                      <NavLink key={child.id} to={child.path} end={child.path === '/'} onClick={onNavigate} className={({ isActive }) => `sub-link ${isActive ? 'active' : ''}`}>
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink key={item.id} to={item.path} end={item.path === '/'} onClick={onNavigate} className={`nav-btn ${active ? 'active' : ''}`} title={item.label}>
              <Icon name={item.icon} />
              <span className="compact-text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="side-footer">
        {sidebarFooter.map((item) => (
          item.action === 'language' ? (
            <button key={item.id} type="button" className="nav-btn" onClick={() => setLanguage((value) => (value === 'English' ? '中文' : 'English'))}>
              <Icon name={item.icon} />
              <span className="compact-text">{language}</span>
            </button>
          ) : (
            <NavLink key={item.id} to={item.path} onClick={onNavigate} className="nav-btn" title={item.label}>
              <Icon name={item.icon} />
              <span className="compact-text">{item.label}</span>
            </NavLink>
          )
        ))}
      </div>
    </aside>
  );
}
