import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { headerGuestActions, headerUserActions } from '../../config/navigation';
import { money } from '../../config/format';
import { useAuth } from '../../store/AuthProvider';
import { useUi } from '../../store/UiProvider';
import Icon from '../icons/Icon';
import Logo from './Logo';
import { useMatchMedia } from './useMatchMedia';

export default function Header() {
  const isMobile = useMatchMedia('(max-width: 767px)');
  const { user, logout } = useAuth();
  const { openAuth, setDepositOpen, setSearchOpen, setDrawerOpen, toggleSidebar } = useUi();
  const [menu, setMenu] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const actions = user ? headerUserActions : headerGuestActions;

  useEffect(() => {
    const onPointer = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenu(null);
    };
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, []);

  const onMenuClick = () => {
    if (isMobile) setDrawerOpen(true);
    else toggleSidebar();
  };

  const runAction = (action) => {
    if (action.id === 'search') setSearchOpen(true);
    if (action.id === 'signin') openAuth('login');
    if (action.id === 'signup') openAuth('signup');
    if (action.id === 'gift') navigate('/promotions');
    if (action.id === 'deposit' || action.id === 'plus' || action.id === 'balance') setDepositOpen(true);
    if (action.id === 'bell') setMenu(menu === 'bell' ? null : 'bell');
    if (action.id === 'avatar') setMenu(menu === 'avatar' ? null : 'avatar');
    if (action.id === 'lang') setMenu(menu === 'lang' ? null : 'lang');
  };

  return (
    <header className="header">
      <div className="header-left">
        {!isMobile && (
          <button type="button" className="icon-btn" aria-label="Toggle sidebar" onClick={onMenuClick}>
            <Icon name="menu" />
          </button>
        )}
        <Logo />
      </div>
      <div className="header-actions" ref={menuRef}>
        {actions.filter((action) => {
          if (action.desktop && isMobile) return false;
          if (action.mobile && !isMobile) return false;
          return true;
        }).map((action) => {
          if (action.kind === 'balance') {
            return (
              <button key={action.id} type="button" className="balance-pill" onClick={() => runAction(action)}>
                <span className="coin">$</span>
                <strong>{money(user?.balance).slice(1)}</strong>
                <Icon name="down" size={14} />
              </button>
            );
          }
          if (action.kind === 'avatar') {
            return (
              <button key={action.id} type="button" className="avatar" style={{ background: user.avatarColor }} onClick={() => runAction(action)} aria-label="Account">
                {user.username.slice(0, 1).toUpperCase()}
              </button>
            );
          }
          if (action.kind === 'lang') {
            return (
              <button key={action.id} type="button" className="lang-btn" onClick={() => runAction(action)}>
                <Icon name="globe" size={16} />
                {action.label}
              </button>
            );
          }
          if (action.kind === 'button') {
            return (
              <button key={action.id} type="button" className={`btn btn-${action.variant}`} onClick={() => runAction(action)}>
                {action.label}
              </button>
            );
          }
          return (
            <button key={action.id} type="button" className={`icon-btn ${action.variant === 'plus' ? 'plus-btn' : ''}`} aria-label={action.id} onClick={() => runAction(action)}>
              <Icon name={action.icon} />
            </button>
          );
        })}
        {menu === 'bell' && (
          <div className="pop pop-bell">
            <strong>Notifications</strong>
            <p>No new notifications.</p>
          </div>
        )}
        {menu === 'lang' && (
          <div className="pop">
            <button type="button" className="pop-item">USD</button>
            <button type="button" className="pop-item">EUR</button>
          </div>
        )}
        {menu === 'avatar' && user && (
          <div className="pop pop-account">
            <strong>{user.username}</strong>
            <p>{user.email}</p>
            <p className="pop-balance">{money(user.balance)} play-money</p>
            <button type="button" onClick={() => { setMenu(null); logout(); }}>Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
