import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import ListingFilters from '../components/ListingFilters';
import { getMakes, getModels } from '../services/carService';
import { getListings } from '../services/listingService';

const defaultFilters = {
  make: '',
  model: '',
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  fuelType: '',
  transmission: '',
  mileageMax: '',
  sort: 'latest',
};

const sortLabels = {
  latest: 'Най-нови',
  price_asc: 'Цена възходящо',
  price_desc: 'Цена низходящо',
  year_desc: 'Година',
};

function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...Object.fromEntries(searchParams.entries()),
  });
  const [listings, setListings] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const makesData = await getMakes();
        setMakes(makesData);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadInitialData();
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

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError('');
        const sanitizedFilters = Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== '')
        );
        const listingsData = await getListings(sanitizedFilters);
        setListings(listingsData);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(
        ([key, value]) => value !== '' && value !== defaultFilters[key]
      ).length,
    [filters]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === 'make' ? { model: '' } : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  return (
    <section className="section listings-page">
      <div className="container">
        <div className="market-hero">
          <div>
            <span className="eyebrow">Marketplace inventory</span>
            <h1>Автомобилни обяви</h1>
            <p>Филтрирай офертите по ключови характеристики и преглеждай пазара по по-ясен начин.</p>
          </div>

          <div className="market-hero__stats">
            <div>
              <strong>{listings.length}</strong>
              <span>налични резултата</span>
            </div>
            <div>
              <strong>{activeFilterCount}</strong>
              <span>активни филтъра</span>
            </div>
            <div>
              <strong>{sortLabels[filters.sort] || 'Най-нови'}</strong>
              <span>сортиране</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container two-column-layout">
        <ListingFilters
          filters={filters}
          makes={makes}
          models={models}
          activeFilterCount={activeFilterCount}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        <div className="content-column">
          <div className="results-toolbar">
            <div className="section-heading">
              <h2>Налични предложения</h2>
              <p>
                {filters.make ? `${filters.make} ` : ''}
                {filters.model ? `${filters.model} ` : ''}
                {filters.make || filters.model ? '• ' : ''}
                {listings.length} резултата
              </p>
            </div>
            <div className="results-toolbar__meta">
              <span className="search-prompt">{sortLabels[filters.sort] || 'Най-нови'}</span>
              {activeFilterCount > 0 && (
                <button className="button button--ghost button--small" type="button" onClick={handleReset}>
                  Изчисти филтрите
                </button>
              )}
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}
          {isLoading && <p className="muted-text">Зареждане на обяви...</p>}

          {!isLoading && listings.length === 0 && (
            <div className="panel empty-state">
              <h3>Няма съвпадения за текущото търсене</h3>
              <p>Промени някой от филтрите или премахни ограниченията, за да видиш повече оферти.</p>
              <div className="inline-actions">
                <button className="button" type="button" onClick={handleReset}>
                  Покажи всички обяви
                </button>
                <Link className="button button--ghost" to="/create-listing">
                  Публикувай автомобил
                </Link>
              </div>
            </div>
          )}

          <div className="card-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ListingsPage;
