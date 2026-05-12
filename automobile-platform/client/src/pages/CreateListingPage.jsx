import { useNavigate } from 'react-router-dom';
import ListingForm from '../components/ListingForm';
import { createListing } from '../services/listingService';

function CreateListingPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const listing = await createListing(payload);
    navigate(`/listings/${listing.id}`);
  };

  return (
    <section className="section">
      <div className="container">
        <ListingForm onSubmit={handleSubmit} submitLabel="Публикувай обявата" />
      </div>
    </section>
  );
}

export default CreateListingPage;
