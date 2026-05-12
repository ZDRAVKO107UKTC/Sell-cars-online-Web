import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validation';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
  });
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
      const validationError = validateRegisterForm(formValues);
      if (validationError) {
        setError(validationError);
        return;
      }

      await register(formValues);
      navigate('/profile');
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
            <h1>Регистрация</h1>
            <span>Създай акаунт и публикувай автомобилни обяви</span>
          </div>

          <div className="field">
            <label htmlFor="username">Потребителско име</label>
            <input id="username" name="username" value={formValues.username} onChange={handleChange} required />
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
            Създай профил
          </button>

          <p className="muted-text">
            Вече имаш акаунт? <Link to="/login">Влез</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
