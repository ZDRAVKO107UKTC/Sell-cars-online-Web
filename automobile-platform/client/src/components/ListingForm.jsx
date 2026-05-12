import { useEffect, useState } from 'react';
import { resolveUploadUrl } from '../config/runtime';
import { getCars, getMakes, getModels } from '../services/carService';
import { validateImageFiles, validateListingForm } from '../utils/validation';

const initialFormState = {
  carId: '',
  title: '',
  description: '',
  price: '',
  year: '',
  mileage: '',
  fuelType: 'Petrol',
  transmission: 'Manual',
  location: '',
  phone: '',
};

const toCalendarDate = (year) => {
  if (!year) {
    return '';
  }

  return `${String(year)}-01-01`;
};

function ListingForm({ initialData, onSubmit, submitLabel, isEditing = false }) {
  const [formValues, setFormValues] = useState({
    ...initialFormState,
    ...initialData,
    carId: initialData?.carId ? String(initialData.carId) : '',
  });
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedMake, setSelectedMake] = useState(initialData?.car?.make || '');
  const [selectedModel, setSelectedModel] = useState(initialData?.car?.model || '');
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [yearCalendarValue, setYearCalendarValue] = useState(toCalendarDate(initialData?.year || ''));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setFormValues({
      ...initialFormState,
      ...initialData,
      carId: initialData.carId ? String(initialData.carId) : '',
    });
    setSelectedMake(initialData.car?.make || '');
    setSelectedModel(initialData.car?.model || '');
    setExistingImages(initialData.images || []);
    setYearCalendarValue(toCalendarDate(initialData.year || ''));
  }, [initialData]);

  useEffect(() => {
    const loadMakes = async () => {
      try {
        const makesData = await getMakes();
        setMakes(makesData);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadMakes();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (!selectedMake) {
        setModels([]);
        return;
      }

      try {
        const modelsData = await getModels(selectedMake);
        setModels(modelsData);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadModels();
  }, [selectedMake]);

  useEffect(() => {
    const loadVariants = async () => {
      if (!selectedMake || !selectedModel) {
        setVariants([]);
        return;
      }

      try {
        const cars = await getCars({ make: selectedMake, model: selectedModel });
        setVariants(cars);

        setFormValues((current) => ({
          ...current,
          carId: current.carId || cars[0]?.id?.toString() || '',
        }));
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadVariants();
  }, [selectedMake, selectedModel]);

  useEffect(() => {
    const previews = newImages.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setNewImagePreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newImages]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleYearChange = (event) => {
    const { value } = event.target;
    setYearCalendarValue(value);
    setFormValues((current) => ({
      ...current,
      year: value ? String(new Date(value).getFullYear()) : '',
    }));
  };

  const handleMakeChange = (event) => {
    const make = event.target.value;
    setSelectedMake(make);
    setSelectedModel('');
    setVariants([]);
    setFormValues((current) => ({ ...current, carId: '' }));
  };

  const handleModelChange = (event) => {
    const model = event.target.value;
    setSelectedModel(model);
    setVariants([]);
    setFormValues((current) => ({ ...current, carId: '' }));
  };

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files || []);
    const validationError = validateImageFiles(files);

    if (validationError) {
      setError(validationError);
      event.target.value = '';
      return;
    }

    setError('');
    setNewImages(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      const validationError = validateListingForm(formValues, existingImages.length, newImages);
      if (validationError) {
        setError(validationError);
        return;
      }

      const payload = new FormData();

      Object.entries(formValues).forEach(([key, value]) => {
        payload.append(key, value);
      });

      payload.append('existingImages', JSON.stringify(existingImages));

      newImages.forEach((image) => {
        payload.append('images', image);
      });

      await onSubmit(payload);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <h1>{isEditing ? 'Редакция на обява' : 'Нова автомобилна обява'}</h1>
        <span>Полетата за автомобил, контакт и снимки</span>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="make">Марка</label>
          <select id="make" value={selectedMake} onChange={handleMakeChange} required>
            <option value="">Избери марка</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="model">Модел</label>
          <select id="model" value={selectedModel} onChange={handleModelChange} required>
            <option value="">Избери модел</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="field field--full">
          <label htmlFor="carId">Вариант</label>
          <select id="carId" name="carId" value={formValues.carId} onChange={handleChange} required>
            <option value="">Избери вариант</option>
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.model} {variant.generation} | {variant.engine} | {variant.horsepower} hp
              </option>
            ))}
          </select>
        </div>

        <div className="field field--full">
          <label htmlFor="title">Заглавие</label>
          <input id="title" name="title" value={formValues.title} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="price">Цена</label>
          <input id="price" name="price" type="number" value={formValues.price} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="year">Година</label>
          <input
            id="year"
            name="year"
            type="date"
            min="1950-01-01"
            max="2035-12-31"
            value={yearCalendarValue}
            onChange={handleYearChange}
            required
          />
          <span className="field__hint">Избери произволен ден от съответната моделна година.</span>
        </div>

        <div className="field">
          <label htmlFor="mileage">Пробег</label>
          <input
            id="mileage"
            name="mileage"
            type="number"
            value={formValues.mileage}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="fuelType">Гориво</label>
          <select id="fuelType" name="fuelType" value={formValues.fuelType} onChange={handleChange} required>
            <option value="Petrol">Бензин</option>
            <option value="Diesel">Дизел</option>
            <option value="Hybrid">Хибрид</option>
            <option value="Electric">Електрически</option>
            <option value="LPG">Газ</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="transmission">Скоростна кутия</label>
          <select
            id="transmission"
            name="transmission"
            value={formValues.transmission}
            onChange={handleChange}
            required
          >
            <option value="Manual">Ръчна</option>
            <option value="Automatic">Автоматична</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="location">Локация</label>
          <input id="location" name="location" value={formValues.location} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="phone">Телефон</label>
          <input id="phone" name="phone" value={formValues.phone} onChange={handleChange} required />
        </div>

        <div className="field field--full">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            rows="6"
            value={formValues.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field field--full">
          <label htmlFor="images">Снимки</label>
          <input
            id="images"
            multiple
            accept="image/*"
            type="file"
            onChange={handleImageSelection}
          />
        </div>
      </div>

      {existingImages.length > 0 && (
        <div className="image-preview-grid">
          {existingImages.map((image) => (
            <div className="image-preview" key={image}>
              <img
                src={resolveUploadUrl(image)}
                alt="Listing preview"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <button
                className="button button--small button--danger"
                onClick={() => setExistingImages((current) => current.filter((item) => item !== image))}
                type="button"
              >
                Премахни
              </button>
            </div>
          ))}
        </div>
      )}

      {newImages.length > 0 && (
        <>
          <div className="image-preview-grid">
            {newImagePreviews.map((image) => (
              <div className="image-preview" key={image.url}>
                <img src={image.url} alt={image.name} />
                <span className="muted-text">{image.name}</span>
              </div>
            ))}
          </div>
          <div className="muted-text">{newImages.length} нови снимки са избрани за качване.</div>
        </>
      )}

      {error && <p className="form-error">{error}</p>}

      <button className="button" disabled={isSubmitting} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

export default ListingForm;
