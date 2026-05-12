import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListingForm from '../components/ListingForm';
import { updateListing, getListingById } from '../services/listingService';

function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadListing = async () => {
      try {
        const listingData = await getListingById(id);
        setListing(listingData);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadListing();
  }, [id]);

  const handleSubmit = async (payload) => {
    const updated = await updateListing(id, payload);
    navigate(`/listings/${updated.id}`);
  };

  return (
    <section className="section">
      <div className="container">
        {error && <p className="form-error">{error}</p>}
        {!listing ? (
          <div className="panel">Зареждане на обявата...</div>
        ) : (
          <ListingForm
            initialData={listing}
            isEditing
            onSubmit={handleSubmit}
            submitLabel="Запази промените"
          />
        )}
      </div>
    </section>
  );
}

export default EditListingPage;
