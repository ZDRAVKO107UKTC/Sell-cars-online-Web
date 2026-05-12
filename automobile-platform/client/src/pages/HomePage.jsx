import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ListingCard from '../components/ListingCard';
import { getMakes, getModels } from '../services/carService';
import { getListings } from '../services/listingService';

function HomePage() {
  const [latestListings, setLatestListings] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceMax: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        const [latestData, makesData] = await Promise.all([
          getListings({ sort: 'latest', limit: 6 }),
          getMakes(),
        ]);

        setLatestListings(latestData);
        setMakes(makesData);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadHomePageData();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (!filters.make) {
        setModels([]);
        return;
      }

      try {
        const modelsData = await getModels(filters.make);
        setModels(modelsData);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadModels();
  }, [filters.make]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === 'make' ? { model: '' } : {}),
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="home-page">
      <HeroSection />

      <section className="section">
        <div className="container">
          <div className="home-search-shell">
            <form className="panel quick-search" onSubmit={handleSearch}>
              <div className="panel-heading">
                <div>
                  <h2>Бързо търсене</h2>
                  <span>Премини директно към най-подходящите обяви за минути</span>
                </div>
                <span className="search-prompt">Търсене по реални параметри</span>
              </div>

              <div className="form-grid search-grid">
                <div className="field">
                  <label htmlFor="home-make">Марка</label>
                  <select id="home-make" name="make" value={filters.make} onChange={handleChange}>
                    <option value="">Всички</option>
                    {makes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="home-model">Модел</label>
                  <select id="home-model" name="model" value={filters.model} onChange={handleChange}>
                    <option value="">Всички</option>
                    {models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="home-priceMax">Цена до</label>
                  <input
                    id="home-priceMax"
                    name="priceMax"
                    type="number"
                    value={filters.priceMax}
                    onChange={handleChange}
                  />
                </div>

                <button className="button search-submit" type="submit">
                  Намери автомобил
                </button>
              </div>
            </form>

            <div className="market-strip">
              <div className="market-strip__item">
                <strong>По-лесно сравнение</strong>
                <span>Цена, пробег, гориво и кутия се виждат веднага още в списъка.</span>
              </div>
              <div className="market-strip__item">
                <strong>Пълни спецификации</strong>
                <span>Поколение, двигател, мощност, задвижване и детайли за модела.</span>
              </div>
              <div className="market-strip__item">
                <strong>Директен контакт</strong>
                <span>Снимки, телефон и коментари под всяка обява за по-бързо решение.</span>
              </div>
            </div>
          </div>

          <div className="home-section-bar">
            <div className="section-heading">
              <h2>Последни обяви</h2>
              <p>Най-новите предложения от платформата, готови за преглед</p>
            </div>
            <Link className="text-link" to="/listings">
              Виж целия пазар
            </Link>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="card-grid">
            {latestListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
