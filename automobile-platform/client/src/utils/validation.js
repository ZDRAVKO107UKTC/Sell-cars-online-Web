const currentYear = new Date().getFullYear() + 1;

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^[+\d][\d\s-]{7,19}$/.test(value);

export const validateLoginForm = ({ email, password }) => {
  if (!email.trim() || !password) {
    return 'Попълни email и парола.';
  }

  if (!isEmail(email.trim())) {
    return 'Въведи валиден email адрес.';
  }

  return '';
};

export const validateRegisterForm = ({ username, email, password }) => {
  if (!username.trim() || !email.trim() || !password) {
    return 'Всички полета са задължителни.';
  }

  if (username.trim().length < 3) {
    return 'Потребителското име трябва да е поне 3 символа.';
  }

  if (!isEmail(email.trim())) {
    return 'Въведи валиден email адрес.';
  }

  if (password.length < 6) {
    return 'Паролата трябва да е поне 6 символа.';
  }

  return '';
};

export const validateProfileForm = ({ username, email, password }) => {
  if (!username.trim() || !email.trim()) {
    return 'Потребителското име и email адресът са задължителни.';
  }

  if (username.trim().length < 3) {
    return 'Потребителското име трябва да е поне 3 символа.';
  }

  if (!isEmail(email.trim())) {
    return 'Въведи валиден email адрес.';
  }

  if (password && password.length < 6) {
    return 'Новата парола трябва да е поне 6 символа.';
  }

  return '';
};

export const validateListingForm = (values, existingImagesCount, newImages) => {
  const title = values.title.trim();
  const description = values.description.trim();
  const location = values.location.trim();
  const phone = values.phone.trim();
  const year = Number(values.year);
  const price = Number(values.price);
  const mileage = Number(values.mileage);

  if (!values.carId) {
    return 'Избери автомобилен вариант.';
  }

  if (!title || !description || !location || !phone) {
    return 'Попълни всички задължителни полета.';
  }

  if (title.length < 10) {
    return 'Заглавието трябва да е поне 10 символа.';
  }

  if (description.length < 30) {
    return 'Описанието трябва да е поне 30 символа.';
  }

  if (!Number.isFinite(price) || price < 100) {
    return 'Цената трябва да е поне 100 лв.';
  }

  if (!Number.isFinite(year) || year < 1950 || year > currentYear) {
    return `Годината трябва да е между 1950 и ${currentYear}.`;
  }

  if (!Number.isFinite(mileage) || mileage < 0 || mileage > 1500000) {
    return 'Пробегът трябва да е между 0 и 1 500 000 км.';
  }

  if (!isPhone(phone)) {
    return 'Въведи валиден телефонен номер.';
  }

  if (existingImagesCount + newImages.length > 8) {
    return 'Можеш да качиш най-много 8 снимки.';
  }

  return '';
};

export const validateCommentContent = (value) => {
  const content = value.trim();

  if (!content) {
    return 'Коментарът не може да е празен.';
  }

  if (content.length < 2) {
    return 'Коментарът е твърде кратък.';
  }

  if (content.length > 1000) {
    return 'Коментарът трябва да е до 1000 символа.';
  }

  return '';
};

export const validateCarForm = (values) => {
  const yearFrom = Number(values.yearFrom);
  const yearTo = values.yearTo ? Number(values.yearTo) : null;
  const horsepower = Number(values.horsepower);

  if (
    !values.make.trim() ||
    !values.model.trim() ||
    !values.generation.trim() ||
    !values.engine.trim()
  ) {
    return 'Попълни всички основни данни за модела.';
  }

  if (!Number.isFinite(yearFrom) || yearFrom < 1950 || yearFrom > currentYear) {
    return `Началната година трябва да е между 1950 и ${currentYear}.`;
  }

  if (yearTo && (!Number.isFinite(yearTo) || yearTo < yearFrom || yearTo > currentYear + 1)) {
    return 'Крайната година трябва да е след или равна на началната.';
  }

  if (!Number.isFinite(horsepower) || horsepower < 30 || horsepower > 2000) {
    return 'Мощността трябва да е между 30 и 2000 hp.';
  }

  return '';
};

export const validateImageFiles = (files) => {
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return 'Разрешени са само изображения.';
    }

    if (file.size > 5 * 1024 * 1024) {
      return 'Всяка снимка трябва да е до 5MB.';
    }
  }

  return '';
};
