import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link className="brand-mark" to="/">
          <span className="brand-mark__badge">AB</span>
          <span>
            AutoBG
            <small>Автомобили с история, не просто с цена</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Начало</NavLink>
          <NavLink to="/listings">Обяви</NavLink>
          {isAuthenticated && <NavLink to="/create-listing">Публикувай</NavLink>}
          {isAuthenticated && <NavLink to="/profile">Профил</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Админ</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-chip">{user.username}</span>
              <button className="button button--ghost" type="button" onClick={handleLogout}>
                Изход
              </button>
            </>
          ) : (
            <>
              <Link className="button button--ghost" to="/login">
                Вход
              </Link>
              <Link className="button" to="/register">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
