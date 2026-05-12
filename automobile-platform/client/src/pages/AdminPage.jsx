import { useEffect, useState } from 'react';
import { createCar, getCars } from '../services/carService';
import { getAllComments } from '../services/commentService';
import { getListings } from '../services/listingService';
import { validateCarForm } from '../utils/validation';

const initialCarState = {
  make: '',
  model: '',
  generation: '',
  yearFrom: '',
  yearTo: '',
  engine: '',
  horsepower: '',
  fuelType: 'Petrol',
  transmission: 'Manual',
  drivetrain: 'FWD',
  bodyType: 'Sedan',
};

function AdminPage() {
  const [formValues, setFormValues] = useState(initialCarState);
  const [cars, setCars] = useState([]);
  const [listings, setListings] = useState([]);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    try {
      const [carsData, listingsData, commentsData] = await Promise.all([
        getCars(),
        getListings({ sort: 'latest', limit: 12 }),
        getAllComments(),
      ]);
      setCars(carsData);
      setListings(listingsData);
      setComments(commentsData);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setMessage('');
      const validationError = validateCarForm(formValues);
      if (validationError) {
        setError(validationError);
        return;
      }

      await createCar(formValues);
      setMessage('Новият автомобилен модел беше добавен успешно.');
      setFormValues(initialCarState);
      await loadAdminData();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <section className="section admin-page">
      <div className="container">
        <div className="profile-overview">
          <div className="section-heading">
            <h1>Админ панел</h1>
            <p>Преглед на съдържанието в платформата и добавяне на нови автомобилни модели.</p>
          </div>
          <div className="profile-overview__stats">
            <div className="hero-summary__item">
              <strong>{cars.length}</strong>
              <span>модела в каталога</span>
            </div>
            <div className="hero-summary__item">
              <strong>{listings.length}</strong>
              <span>последни обяви</span>
            </div>
            <div className="hero-summary__item">
              <strong>{comments.length}</strong>
              <span>последни коментари</span>
            </div>
          </div>
        </div>

        <div className="admin-layout">
          <form className="panel" onSubmit={handleSubmit}>
            <div className="panel-heading">
              <h2>Нов автомобилен модел</h2>
              <span>Добави запис в каталога, който после може да се използва в обявите.</span>
            </div>

            <div className="form-grid">
              {Object.entries(formValues).map(([key, value]) => (
                <div className="field" key={key}>
                  <label htmlFor={key}>{key}</label>
                  {['fuelType', 'transmission', 'drivetrain', 'bodyType'].includes(key) ? (
                    <select id={key} name={key} value={value} onChange={handleChange}>
                      {key === 'fuelType' && (
                        <>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Electric">Electric</option>
                          <option value="LPG">LPG</option>
                        </>
                      )}
                      {key === 'transmission' && (
                        <>
                          <option value="Manual">Manual</option>
                          <option value="Automatic">Automatic</option>
                        </>
                      )}
                      {key === 'drivetrain' && (
                        <>
                          <option value="FWD">FWD</option>
                          <option value="RWD">RWD</option>
                          <option value="AWD">AWD</option>
                        </>
                      )}
                      {key === 'bodyType' && (
                        <>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Hatchback">Hatchback</option>
                          <option value="Combi">Combi</option>
                          <option value="Coupe">Coupe</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <input
                      id={key}
                      name={key}
                      type={['yearFrom', 'yearTo', 'horsepower'].includes(key) ? 'number' : 'text'}
                      value={value}
                      onChange={handleChange}
                      required={key !== 'yearTo'}
                    />
                  )}
                </div>
              ))}
            </div>

            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error">{error}</p>}

            <button className="button" type="submit">
              Добави автомобил
            </button>
          </form>

          <div className="content-column">
            <div className="panel">
              <div className="panel-heading">
                <h2>Налични модели</h2>
                <span>{cars.length} записа</span>
              </div>
              <div className="stack-list">
                {cars.slice(0, 10).map((car) => (
                  <div className="stack-item" key={car.id}>
                    <strong>
                      {car.make} {car.model}
                    </strong>
                    <span>
                      {car.generation} | {car.engine} | {car.horsepower} hp
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h2>Последни обяви</h2>
                <span>{listings.length} показани</span>
              </div>
              <div className="stack-list">
                {listings.map((listing) => (
                  <div className="stack-item" key={listing.id}>
                    <strong>{listing.title}</strong>
                    <span>{listing.user?.username} | {Number(listing.price).toLocaleString('bg-BG')} лв.</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h2>Последни коментари</h2>
                <span>{comments.length} показани</span>
              </div>
              <div className="stack-list">
                {comments.map((comment) => (
                  <div className="stack-item" key={comment.id}>
                    <strong>{comment.user?.username}</strong>
                    <span>{comment.listing?.title}</span>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
