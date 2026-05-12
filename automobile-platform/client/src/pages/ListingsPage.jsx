import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    <section className="section">
      <div className="container">
        <div className="market-hero">
          <div>
            <span className="eyebrow">Marketplace inventory</span>
            <h1>Автомобилни обяви</h1>
            <p>Филтрирай офертите по ключови характеристики и сравни предложенията бързо.</p>
          </div>

          <div className="market-hero__stats">
            <div>
              <strong>{listings.length}</strong>
              <span>активни резултата</span>
            </div>
            <div>
              <strong>{filters.make || 'Всички'}</strong>
              <span>избрана марка</span>
            </div>
            <div>
              <strong>{filters.sort === 'latest' ? 'Нови' : 'Custom'}</strong>
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
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        <div className="content-column">
          <div className="section-heading">
            <h2>Налични предложения</h2>
            <p>{listings.length} резултата</p>
          </div>

          {error && <p className="form-error">{error}</p>}
          {isLoading && <p className="muted-text">Зареждане на обяви...</p>}

          {!isLoading && listings.length === 0 && (
            <div className="panel">
              <p>Няма намерени обяви по избраните критерии.</p>
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
