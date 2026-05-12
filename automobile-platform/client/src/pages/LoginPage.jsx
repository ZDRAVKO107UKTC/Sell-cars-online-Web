import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');
      await login(formValues);
      navigate(location.state?.from?.pathname || '/profile');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="container auth-shell">
        <form className="panel auth-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <h1>Вход</h1>
            <span>Достъп до профила и твоите обяви</span>
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formValues.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="password">Парола</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="button" disabled={isSubmitting} type="submit">
            Влез
          </button>

          <p className="muted-text">
            Нямаш акаунт? <Link to="/register">Регистрирай се</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
