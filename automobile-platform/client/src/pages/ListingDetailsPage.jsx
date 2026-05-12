import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { resolveUploadUrl } from '../config/runtime';
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
  const [failedImages, setFailedImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadListing = async () => {
    try {
      setIsLoading(true);
      const [listingData, commentsData] = await Promise.all([getListingById(id), getListingComments(id)]);
      const initialImages = (listingData.images || [])
        .map((image) => resolveUploadUrl(image))
        .filter(Boolean);

      setListing(listingData);
      setComments(commentsData);
      setFailedImages([]);
      setActiveImage(initialImages[0] || '');
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListing();
  }, [id]);

  const resolvedImages = useMemo(
    () =>
      (listing?.images || [])
        .map((image) => resolveUploadUrl(image))
        .filter((image) => image && !failedImages.includes(image)),
    [listing, failedImages]
  );

  const mapQuery = useMemo(() => {
    if (!listing?.location) {
      return '';
    }

    return encodeURIComponent(`${listing.location}, Bulgaria`);
  }, [listing]);

  const mapEmbedUrl = mapQuery
    ? `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : '';
  const mapDirectionsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
    : '';

  useEffect(() => {
    if (!activeImage && resolvedImages[0]) {
      setActiveImage(resolvedImages[0]);
    }
  }, [activeImage, resolvedImages]);

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

  const handleMainImageError = () => {
    if (!activeImage) {
      return;
    }

    setFailedImages((current) => (current.includes(activeImage) ? current : [...current, activeImage]));
    const nextImage = resolvedImages.find((image) => image !== activeImage);
    setActiveImage(nextImage || '');
  };

  const canManageListing = user && listing && (user.role === 'admin' || user.id === listing.userId);

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
    <section className="section details-page">
      <div className="container">
        <div className="details-breadcrumb">
          <Link className="text-link" to="/listings">
            Към всички обяви
          </Link>
          <span>/</span>
          <span>
            {listing.car?.make} {listing.car?.model}
          </span>
        </div>
      </div>

      <div className="container details-layout">
        {error && <p className="form-error">{error}</p>}

        <div className="details-main">
          <div className="panel gallery-panel">
            {activeImage ? (
              <img
                className="gallery-main"
                src={activeImage}
                alt={listing.title}
                onError={handleMainImageError}
              />
            ) : (
              <div className="gallery-main gallery-main--empty">Няма налична снимка за тази обява</div>
            )}

            {resolvedImages.length > 1 && (
              <div className="gallery-thumbs">
                {resolvedImages.map((image) => (
                  <button
                    className={`gallery-thumb ${activeImage === image ? 'gallery-thumb--active' : ''}`}
                    key={image}
                    onClick={() => setActiveImage(image)}
                    type="button"
                  >
                    <img
                      src={image}
                      alt={listing.title}
                      onError={() =>
                        setFailedImages((current) => (current.includes(image) ? current : [...current, image]))
                      }
                    />
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
                  <span>{comments.length} коментара</span>
                </div>
              </div>
              <div className="price-block">{Number(listing.price).toLocaleString('bg-BG')} лв.</div>
            </div>

            <div className="details-quick-meta">
              <span className="spec-pill">{listing.year} г.</span>
              <span className="spec-pill">{Number(listing.mileage).toLocaleString('bg-BG')} км</span>
              <span className="spec-pill">{listing.fuelType}</span>
              <span className="spec-pill">{listing.transmission}</span>
            </div>

            <div className="spec-grid">
              <div>
                <strong>Година</strong>
                <span>{listing.year}</span>
              </div>
              <div>
                <strong>Пробег</strong>
                <span>{Number(listing.mileage).toLocaleString('bg-BG')} км</span>
              </div>
              <div>
                <strong>Гориво</strong>
                <span>{listing.fuelType}</span>
              </div>
              <div>
                <strong>Скоростна кутия</strong>
                <span>{listing.transmission}</span>
              </div>
              <div>
                <strong>Двигател</strong>
                <span>{listing.car?.engine}</span>
              </div>
              <div>
                <strong>Мощност</strong>
                <span>{listing.car?.horsepower} hp</span>
              </div>
              <div>
                <strong>Задвижване</strong>
                <span>{listing.car?.drivetrain}</span>
              </div>
              <div>
                <strong>Купе</strong>
                <span>{listing.car?.bodyType}</span>
              </div>
            </div>

            <div className="content-stack">
              <div>
                <h2>Описание</h2>
                <p>{listing.description}</p>
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
              <span>Свържи се директно с продавача и провери наличността.</span>
            </div>
            <div className="contact-panel__value">{listing.phone}</div>
            <div className="contact-panel__items">
              <span>{listing.location}</span>
              <span>{listing.fuelType}</span>
              <span>{listing.transmission}</span>
              <span>{Number(listing.mileage).toLocaleString('bg-BG')} км</span>
            </div>
          </div>

          <div className="panel details-side-panel">
            <div className="panel-heading">
              <h2>Обява накратко</h2>
              <span>Основните данни са събрани за по-бърз преглед.</span>
            </div>
            <div className="stack-list">
              <div className="stack-item">
                <strong>Модел</strong>
                <span>
                  {listing.car?.make} {listing.car?.model} {listing.car?.generation}
                </span>
              </div>
              <div className="stack-item">
                <strong>Собственик</strong>
                <span>{listing.user?.username}</span>
              </div>
              <div className="stack-item">
                <strong>Публикувана</strong>
                <span>{new Date(listing.createdAt).toLocaleDateString('bg-BG')}</span>
              </div>
            </div>
          </div>

          {mapEmbedUrl && (
            <div className="panel map-panel">
              <div className="panel-heading">
                <h2>Локация</h2>
                <span>Прегледай района на картата и отвори навигация в Google Maps.</span>
              </div>
              <div className="map-frame">
                <iframe
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedUrl}
                  title={`Map for ${listing.location}`}
                />
              </div>
              <a className="text-link map-link" href={mapDirectionsUrl} rel="noreferrer" target="_blank">
                Отвори локацията в Google Maps
              </a>
            </div>
          )}

          <CommentSection
            comments={comments}
            user={user}
            onCreate={async (payload) => {
              await createComment(id, payload);
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
            onUpdate={async (commentId, payload) => {
              await updateComment(commentId, payload);
              await loadListing();
            }}
          />
        </aside>
      </div>
    </section>
  );
}

export default ListingDetailsPage;
