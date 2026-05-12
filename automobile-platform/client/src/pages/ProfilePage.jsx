import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import { getListingsByUser } from '../services/listingService';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [formValues, setFormValues] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        return;
      }

      try {
        const listings = await getListingsByUser(user.id);
        setMyListings(listings);
        setFormValues({
          username: user.username,
          email: user.email,
          password: '',
        });
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadProfileData();
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setMessage('');
      const payload = {
        username: formValues.username,
        email: formValues.email,
      };

      if (formValues.password) {
        payload.password = formValues.password;
      }

      await updateProfile(payload);
      setMessage('Профилът беше обновен успешно.');
      setFormValues((current) => ({ ...current, password: '' }));
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <section className="section profile-page">
      <div className="container">
        <div className="profile-overview">
          <div className="section-heading">
            <h1>Моят профил</h1>
            <p>Управлявай акаунта си и следи публикуваните обяви от едно място.</p>
          </div>
          <div className="profile-overview__stats">
            <div className="hero-summary__item">
              <strong>{myListings.length}</strong>
              <span>публикувани обяви</span>
            </div>
            <div className="hero-summary__item">
              <strong>{user?.role === 'admin' ? 'Admin' : 'User'}</strong>
              <span>тип на акаунта</span>
            </div>
            <div className="hero-summary__item">
              <strong>{user?.email}</strong>
              <span>основен email</span>
            </div>
          </div>
        </div>

        <div className="profile-layout">
          <form className="panel profile-panel" onSubmit={handleSubmit}>
            <div className="panel-heading">
              <h2>Настройки на профила</h2>
              <span>Обнови данните за вход и потребителското име.</span>
            </div>

            <div className="field">
              <label htmlFor="profile-username">Потребителско име</label>
              <input
                id="profile-username"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="profile-password">Нова парола</label>
              <input
                id="profile-password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
              />
            </div>

            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error">{error}</p>}

            <button className="button" type="submit">
              Запази профила
            </button>
          </form>

          <div className="content-column">
            <div className="home-section-bar">
              <div className="section-heading">
                <h2>Моите обяви</h2>
                <p>{myListings.length} публикувани обяви</p>
              </div>
              <Link className="text-link" to="/create-listing">
                Нова обява
              </Link>
            </div>

            {myListings.length === 0 ? (
              <div className="panel empty-state">
                <h3>Все още нямаш публикувани обяви</h3>
                <p>Създай първата си автомобилна обява и ще я виждаш тук заедно с всички бъдещи редакции.</p>
                <div className="inline-actions">
                  <Link className="button" to="/create-listing">
                    Публикувай автомобил
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card-grid">
                {myListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
