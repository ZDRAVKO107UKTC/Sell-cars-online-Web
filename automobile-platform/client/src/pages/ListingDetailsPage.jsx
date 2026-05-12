import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { uploadsBaseUrl } from '../config/runtime';
import { useAuth } from '../context/AuthContext';
import {
  createComment,
  deleteComment,
  getListingComments,
  likeComment,
  updateComment,
} from '../services/commentService';
import { deleteListing, getListingById } from '../services/listingService';

function ListingDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [comments, setComments] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadListing = async () => {
    try {
      setIsLoading(true);
      const [listingData, commentsData] = await Promise.all([
        getListingById(id),
        getListingComments(id),
      ]);
      setListing(listingData);
      setComments(commentsData);
      setActiveImage(listingData.images?.[0] ? `${uploadsBaseUrl}${listingData.images[0]}` : '');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListing();
  }, [id]);

  const handleDeleteListing = async () => {
    if (!window.confirm('Сигурен ли си, че искаш да изтриеш тази обява?')) {
      return;
    }

    try {
      await deleteListing(id);
      navigate('/listings');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const canManageListing =
    user && listing && (user.role === 'admin' || user.id === listing.userId);

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">Зареждане...</div>
      </section>
    );
  }

  if (!listing) {
    return (
      <section className="section">
        <div className="container">
          <div className="panel">
            <p>Обявата не беше намерена.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container details-layout">
        {error && <p className="form-error">{error}</p>}

        <div className="details-main">
          <div className="panel gallery-panel">
            {activeImage ? (
              <img className="gallery-main" src={activeImage} alt={listing.title} />
            ) : (
              <div className="gallery-main gallery-main--empty">Няма качени снимки</div>
            )}

            {listing.images?.length > 1 && (
              <div className="gallery-thumbs">
                {listing.images.map((image) => (
                  <button
                    className="gallery-thumb"
                    key={image}
                    onClick={() => setActiveImage(`${uploadsBaseUrl}${image}`)}
                    type="button"
                  >
                    <img src={`${uploadsBaseUrl}${image}`} alt={listing.title} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <div className="details-header">
              <div className="details-header__main">
                <span className="tag">
                  {listing.car?.make} {listing.car?.model}
                </span>
                <h1>{listing.title}</h1>
                <div className="details-lead">
                  <span>{listing.location}</span>
                  <span>Продавач: {listing.user?.username}</span>
                </div>
              </div>
              <div className="price-block">{Number(listing.price).toLocaleString('bg-BG')} лв.</div>
            </div>

            <div className="spec-grid">
              <div><strong>Година</strong><span>{listing.year}</span></div>
              <div><strong>Пробег</strong><span>{Number(listing.mileage).toLocaleString('bg-BG')} км</span></div>
              <div><strong>Гориво</strong><span>{listing.fuelType}</span></div>
              <div><strong>Скоростна кутия</strong><span>{listing.transmission}</span></div>
              <div><strong>Двигател</strong><span>{listing.car?.engine}</span></div>
              <div><strong>Мощност</strong><span>{listing.car?.horsepower} hp</span></div>
              <div><strong>Задвижване</strong><span>{listing.car?.drivetrain}</span></div>
              <div><strong>Купе</strong><span>{listing.car?.bodyType}</span></div>
            </div>

            <div className="content-stack">
              <div>
                <h2>Описание</h2>
                <p>{listing.description}</p>
              </div>
              <div>
                <h2>Контакт</h2>
                <p>{listing.phone}</p>
              </div>
              <div>
                <h2>Техническа база</h2>
                <p>
                  {listing.car?.make} {listing.car?.model} {listing.car?.generation} ({listing.car?.yearFrom}
                  {listing.car?.yearTo ? ` - ${listing.car.yearTo}` : ' - до момента'})
                </p>
              </div>
            </div>

            {canManageListing && (
              <div className="inline-actions">
                <Link className="button" to={`/edit-listing/${listing.id}`}>
                  Редактирай
                </Link>
                <button className="button button--danger" onClick={handleDeleteListing} type="button">
                  Изтрий
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="details-sidebar">
          <div className="panel contact-panel">
            <div className="panel-heading">
              <h2>Бърз контакт</h2>
              <span>Свържи се директно с продавача</span>
            </div>
            <div className="contact-panel__value">{listing.phone}</div>
            <div className="contact-panel__items">
              <span>{listing.fuelType}</span>
              <span>{listing.transmission}</span>
              <span>{Number(listing.mileage).toLocaleString('bg-BG')} км</span>
            </div>
          </div>

          <CommentSection
            comments={comments}
            user={user}
            onCreate={async (payload) => {
              await createComment(id, payload);
              await loadListing();
            }}
            onUpdate={async (commentId, payload) => {
              await updateComment(commentId, payload);
              await loadListing();
            }}
            onDelete={async (commentId) => {
              await deleteComment(commentId);
              await loadListing();
            }}
            onLike={async (commentId) => {
              await likeComment(commentId);
              await loadListing();
            }}
          />
        </aside>
      </div>
    </section>
  );
}

export default ListingDetailsPage;
