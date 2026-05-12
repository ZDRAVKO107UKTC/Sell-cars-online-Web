import { Link } from 'react-router-dom';
import { uploadsBaseUrl } from '../config/runtime';

function ListingCard({ listing }) {
  const primaryImage = listing.images?.[0] ? `${uploadsBaseUrl}${listing.images[0]}` : null;
  const cardTitle = `${listing.car?.make || ''} ${listing.car?.model || ''}`.trim();

  return (
    <article className="listing-card">
      <div className="listing-card__media">
        {primaryImage ? (
          <img className="listing-card__image" src={primaryImage} alt={listing.title} />
        ) : (
          <div className="listing-card__placeholder">AutoBG</div>
        )}

        <div className="listing-card__overlay" />
        <div className="listing-card__price">{Number(listing.price).toLocaleString('bg-BG')} лв.</div>
      </div>

      <div className="listing-card__body">
        <div className="listing-card__top">
          <div className="listing-card__title-stack">
            <span className="tag">{cardTitle || 'Автомобилна обява'}</span>
            {listing.car?.generation && <span className="listing-card__generation">{listing.car.generation}</span>}
          </div>
          <span className="listing-card__year">{listing.year} г.</span>
        </div>

        <div className="listing-card__headline">
          <h3>{listing.title}</h3>
          <p>{listing.description.slice(0, 120)}...</p>
        </div>

        <div className="meta-grid">
          <span className="spec-pill">{Number(listing.mileage).toLocaleString('bg-BG')} км</span>
          <span className="spec-pill">{listing.fuelType}</span>
          <span className="spec-pill">{listing.transmission}</span>
          {listing.car?.horsepower && <span className="spec-pill">{listing.car.horsepower} hp</span>}
        </div>

        <div className="listing-card__footer">
          <div className="listing-card__seller">
            <span className="listing-card__location">{listing.location}</span>
            <small>{listing.user?.username || 'Потребител'}</small>
          </div>
          <Link className="text-link" to={`/listings/${listing.id}`}>
            Виж детайли
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ListingCard;
