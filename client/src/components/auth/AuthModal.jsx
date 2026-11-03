import { useState } from 'react';
import { messages, validateLogin, validateRegister } from '../../config/messages';
import { useAuth } from '../../store/AuthProvider';
import { useUi } from '../../store/UiProvider';
import Icon from '../icons/Icon';
import Modal from '../common/Modal';

const empty = { username: '', email: '', password: '', confirmPassword: '' };

export default function AuthModal() {
  const { authMode, openAuth, closeAuth, pushToast } = useUi();
  const { login, register } = useAuth();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const isLogin = authMode === 'login';

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = isLogin ? validateLogin(form) : validateRegister(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      if (isLogin) await login({ email: form.email.trim(), password: form.password });
      else await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setForm(empty);
      closeAuth();
      pushToast(isLogin ? 'Signed in' : 'Account created with $1,000 play-money', 'ok');
    } catch (error) {
      setErrors(error.errors || { form: error.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={Boolean(authMode)} title={isLogin ? 'Sign In' : 'Sign Up'} onClose={closeAuth}>
      <div className="auth-switch">
        <button type="button" className={isLogin ? 'on' : ''} onClick={() => { openAuth('login'); setErrors({}); }}>Sign In</button>
        <button type="button" className={!isLogin ? 'on' : ''} onClick={() => { openAuth('signup'); setErrors({}); }}>Sign Up</button>
      </div>
      <form className="auth-form" onSubmit={submit} noValidate>
        {!isLogin && (
          <label>
            Username
            <input value={form.username} onChange={(event) => setField('username', event.target.value)} placeholder="Username" autoComplete="username" />
            {errors.username && <small>{errors.username}</small>}
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} placeholder="Email" autoComplete="email" />
          {errors.email && <small>{errors.email}</small>}
        </label>
        <label>
          Password
          <span className="input-wrap">
            <input type={show ? 'text' : 'password'} value={form.password} onChange={(event) => setField('password', event.target.value)} placeholder="Password" autoComplete={isLogin ? 'current-password' : 'new-password'} />
            <button type="button" className="ghost-eye" onClick={() => setShow((value) => !value)} aria-label={show ? 'Hide password' : 'Show password'}>
              <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
            </button>
          </span>
          {!isLogin && <em className="hint">{messages.auth.passwordRules}</em>}
          {errors.password && <small>{errors.password}</small>}
        </label>
        {!isLogin && (
          <label>
            Confirm password
            <input type={show ? 'text' : 'password'} value={form.confirmPassword} onChange={(event) => setField('confirmPassword', event.target.value)} placeholder="Confirm password" autoComplete="new-password" />
            {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
          </label>
        )}
        {errors.form && <small className="form-error">{errors.form}</small>}
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? 'Please wait...' : isLogin ? 'Sign In' : 'Create account'}
        </button>
        <p className="demo-note">Demo play-money only. No real-money wagering.</p>
      </form>
    </Modal>
  );
}
