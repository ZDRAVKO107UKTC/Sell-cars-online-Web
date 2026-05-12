const currentYear = new Date().getFullYear() + 1;

const allowedFuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'];
const allowedTransmissions = ['Manual', 'Automatic'];
const allowedDrivetrains = ['FWD', 'RWD', 'AWD'];
const allowedBodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Combi', 'Coupe'];

const cleanString = (value) => (typeof value === 'string' ? value.trim() : '');
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^[+\d][\d\s-]{7,19}$/.test(value);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const validateAuthPayload = ({ username, email, password }, isUpdate = false) => {
  const cleanUsername = cleanString(username);
  const cleanEmail = cleanString(email).toLowerCase();

  if (!isUpdate || username !== undefined) {
    if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 30) {
      return { valid: false, message: 'Username must be between 3 and 30 characters.' };
    }
  }

  if (!isUpdate || email !== undefined) {
    if (!cleanEmail || !isEmail(cleanEmail)) {
      return { valid: false, message: 'A valid email address is required.' };
    }
  }

  if (!isUpdate || password !== undefined) {
    if (!password || password.length < 6 || password.length > 100) {
      return { valid: false, message: 'Password must be between 6 and 100 characters.' };
    }
  }

  return {
    valid: true,
    values: {
      username: cleanUsername,
      email: cleanEmail,
      password,
    },
  };
};

const validateListingPayload = (payload) => {
  const price = toNumber(payload.price);
  const year = toNumber(payload.year);
  const mileage = toNumber(payload.mileage);
  const carId = toNumber(payload.carId);
  const title = cleanString(payload.title);
  const description = cleanString(payload.description);
  const location = cleanString(payload.location);
  const phone = cleanString(payload.phone);

  if (!carId) {
    return { valid: false, message: 'A valid car variant is required.' };
  }

  if (!title || title.length < 10 || title.length > 140) {
    return { valid: false, message: 'Title must be between 10 and 140 characters.' };
  }

  if (!description || description.length < 30 || description.length > 5000) {
    return { valid: false, message: 'Description must be between 30 and 5000 characters.' };
  }

  if (price === null || price < 100 || price > 100000000) {
    return { valid: false, message: 'Price must be between 100 and 100000000.' };
  }

  if (year === null || year < 1950 || year > currentYear) {
    return { valid: false, message: `Year must be between 1950 and ${currentYear}.` };
  }

  if (mileage === null || mileage < 0 || mileage > 1500000) {
    return { valid: false, message: 'Mileage must be between 0 and 1500000.' };
  }

  if (!allowedFuelTypes.includes(payload.fuelType)) {
    return { valid: false, message: 'Invalid fuel type.' };
  }

  if (!allowedTransmissions.includes(payload.transmission)) {
    return { valid: false, message: 'Invalid transmission type.' };
  }

  if (!location || location.length < 2 || location.length > 80) {
    return { valid: false, message: 'Location must be between 2 and 80 characters.' };
  }

  if (!phone || !isPhone(phone)) {
    return { valid: false, message: 'A valid phone number is required.' };
  }

  return {
    valid: true,
    values: {
      carId,
      title,
      description,
      price,
      year,
      mileage,
      fuelType: payload.fuelType,
      transmission: payload.transmission,
      location,
      phone,
    },
  };
};

const validateComment = (content) => {
  const cleanContent = cleanString(content);

  if (!cleanContent || cleanContent.length < 2 || cleanContent.length > 1000) {
    return { valid: false, message: 'Comment must be between 2 and 1000 characters.' };
  }

  return {
    valid: true,
    value: cleanContent,
  };
};

const validateCarPayload = (payload) => {
  const make = cleanString(payload.make);
  const model = cleanString(payload.model);
  const generation = cleanString(payload.generation);
  const engine = cleanString(payload.engine);
  const yearFrom = toNumber(payload.yearFrom);
  const yearTo = payload.yearTo ? toNumber(payload.yearTo) : null;
  const horsepower = toNumber(payload.horsepower);

  if (!make || !model || !generation || !engine) {
    return { valid: false, message: 'Make, model, generation and engine are required.' };
  }

  if (yearFrom === null || yearFrom < 1950 || yearFrom > currentYear) {
    return { valid: false, message: `Year from must be between 1950 and ${currentYear}.` };
  }

  if (yearTo !== null && (yearTo < yearFrom || yearTo > currentYear + 1)) {
    return { valid: false, message: 'Year to must be greater than or equal to year from.' };
  }

  if (horsepower === null || horsepower < 30 || horsepower > 2000) {
    return { valid: false, message: 'Horsepower must be between 30 and 2000.' };
  }

  if (!allowedFuelTypes.includes(payload.fuelType)) {
    return { valid: false, message: 'Invalid fuel type.' };
  }

  if (!allowedTransmissions.includes(payload.transmission)) {
    return { valid: false, message: 'Invalid transmission type.' };
  }

  if (!allowedDrivetrains.includes(payload.drivetrain)) {
    return { valid: false, message: 'Invalid drivetrain type.' };
  }

  if (!allowedBodyTypes.includes(payload.bodyType)) {
    return { valid: false, message: 'Invalid body type.' };
  }

  return {
    valid: true,
    values: {
      make,
      model,
      generation,
      yearFrom,
      yearTo,
      engine,
      horsepower,
      fuelType: payload.fuelType,
      transmission: payload.transmission,
      drivetrain: payload.drivetrain,
      bodyType: payload.bodyType,
    },
  };
};

module.exports = {
  validateAuthPayload,
  validateListingPayload,
  validateComment,
  validateCarPayload,
  cleanString,
};
