const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const createUser = require('./User');
const createCar = require('./Car');
const createListing = require('./Listing');
const createComment = require('./Comment');

const User = createUser(sequelize);
const Car = createCar(sequelize);
const Listing = createListing(sequelize);
const Comment = createComment(sequelize);

User.hasMany(Listing, { foreignKey: 'userId', as: 'listings', onDelete: 'CASCADE' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });

Car.hasMany(Listing, { foreignKey: 'carId', as: 'listings', onDelete: 'RESTRICT' });

Listing.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Listing.belongsTo(Car, { foreignKey: 'carId', as: 'car' });
Listing.hasMany(Comment, { foreignKey: 'listingId', as: 'comments', onDelete: 'CASCADE' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

const defaultCars = [
  {
    make: 'BMW',
    model: '3 Series',
    generation: 'G20',
    yearFrom: 2019,
    yearTo: null,
    engine: '2.0 320d',
    horsepower: 190,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    drivetrain: 'RWD',
    bodyType: 'Sedan',
  },
  {
    make: 'BMW',
    model: '5 Series',
    generation: 'G30',
    yearFrom: 2017,
    yearTo: null,
    engine: '2.0 530i',
    horsepower: 252,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    drivetrain: 'RWD',
    bodyType: 'Sedan',
  },
  {
    make: 'Audi',
    model: 'A4',
    generation: 'B9',
    yearFrom: 2016,
    yearTo: null,
    engine: '2.0 TDI',
    horsepower: 190,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    bodyType: 'Sedan',
  },
  {
    make: 'Mercedes-Benz',
    model: 'C-Class',
    generation: 'W205',
    yearFrom: 2014,
    yearTo: 2021,
    engine: '2.0 C200',
    horsepower: 184,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    drivetrain: 'RWD',
    bodyType: 'Sedan',
  },
  {
    make: 'Volkswagen',
    model: 'Golf',
    generation: 'Mk7',
    yearFrom: 2013,
    yearTo: 2020,
    engine: '2.0 TDI',
    horsepower: 150,
    fuelType: 'Diesel',
    transmission: 'Manual',
    drivetrain: 'FWD',
    bodyType: 'Hatchback',
  },
  {
    make: 'Skoda',
    model: 'Octavia',
    generation: 'III',
    yearFrom: 2013,
    yearTo: 2020,
    engine: '2.0 TDI',
    horsepower: 150,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    drivetrain: 'FWD',
    bodyType: 'Combi',
  },
  {
    make: 'Toyota',
    model: 'Corolla',
    generation: 'E210',
    yearFrom: 2019,
    yearTo: null,
    engine: '1.8 Hybrid',
    horsepower: 140,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    drivetrain: 'FWD',
    bodyType: 'Sedan',
  },
  {
    make: 'Honda',
    model: 'Civic',
    generation: 'X',
    yearFrom: 2016,
    yearTo: 2021,
    engine: '1.5 VTEC Turbo',
    horsepower: 182,
    fuelType: 'Petrol',
    transmission: 'Manual',
    drivetrain: 'FWD',
    bodyType: 'Hatchback',
  },
];

const seedUsers = [
  {
    username: 'ivan_petrov',
    email: 'ivan.petrov@autobg.demo',
    password: 'autobg123',
    role: 'user',
  },
  {
    username: 'maria_ivanova',
    email: 'maria.ivanova@autobg.demo',
    password: 'autobg123',
    role: 'user',
  },
  {
    username: 'georgi_dimitrov',
    email: 'georgi.dimitrov@autobg.demo',
    password: 'autobg123',
    role: 'user',
  },
];

const seedListings = [
  {
    sellerEmail: 'ivan.petrov@autobg.demo',
    carKey: 'BMW|3 Series|G20',
    title: 'BMW 320d G20 M Sport, сервизна история, отлично състояние',
    description:
      'Автомобилът е поддържан само в оторизиран сервиз. Разполага с LED фарове, спортен салон, навигация, парктроник отпред и отзад, камера, адаптивен темпомат и двузонов климатроник. Без удари, с реален пробег и налични фактури за обслужване.',
    price: 42900,
    year: 2020,
    mileage: 118000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'София',
    phone: '0888123456',
    images: [],
  },
  {
    sellerEmail: 'maria.ivanova@autobg.demo',
    carKey: 'Audi|A4|B9',
    title: 'Audi A4 B9 2.0 TDI quattro, S line, панорама',
    description:
      'Много добро визуално и техническо състояние. Оборудване S line, кожен салон, виртуален кокпит, подгрев на седалките, ел. багажник и безключов достъп. Автомобилът е внесен и регистриран, готов за каране.',
    price: 38900,
    year: 2019,
    mileage: 136500,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Пловдив',
    phone: '0897456123',
    images: [],
  },
  {
    sellerEmail: 'georgi.dimitrov@autobg.demo',
    carKey: 'Mercedes-Benz|C-Class|W205',
    title: 'Mercedes-Benz C200 Avantgarde, бензин, автоматик',
    description:
      'Запазен интериор и екстериор, обслужен двигател и скоростна кутия, налични два ключа. Има навигация, камера за заден ход, ел. седалки, амбиентно осветление и асистент за следене на лентата.',
    price: 33500,
    year: 2018,
    mileage: 149000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Варна',
    phone: '0879988776',
    images: [],
  },
  {
    sellerEmail: 'ivan.petrov@autobg.demo',
    carKey: 'Volkswagen|Golf|Mk7',
    title: 'Volkswagen Golf 7 2.0 TDI, първи собственик в България',
    description:
      'Практичен и икономичен автомобил с ръчна скоростна кутия, поддържан редовно и без належащи ремонти. Оборудван е с мултимедия, климатроник, подгрев на седалките и сензори за паркиране.',
    price: 18900,
    year: 2017,
    mileage: 171000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    location: 'Бургас',
    phone: '0885667788',
    images: [],
  },
  {
    sellerEmail: 'maria.ivanova@autobg.demo',
    carKey: 'Skoda|Octavia|III',
    title: 'Skoda Octavia Combi 2.0 TDI DSG, семеен автомобил',
    description:
      'Комфортен комби автомобил с голям багажник, поддържан в сервиз и с много добро окачване. Разполага с CarPlay, автопилот, климатроник, подгрев и отлични летни и зимни гуми.',
    price: 21400,
    year: 2018,
    mileage: 162000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Русе',
    phone: '0899123123',
    images: [],
  },
  {
    sellerEmail: 'georgi.dimitrov@autobg.demo',
    carKey: 'Toyota|Corolla|E210',
    title: 'Toyota Corolla 1.8 Hybrid, икономична и надеждна',
    description:
      'Перфектна за градско и извънградско каране. Нисък разход, безшумна работа, адаптивен круиз контрол, активни системи за безопасност и пълна сервизна история. Налична е за оглед след уговорка.',
    price: 31400,
    year: 2021,
    mileage: 84000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    location: 'Стара Загора',
    phone: '0877456123',
    images: [],
  },
  {
    sellerEmail: 'ivan.petrov@autobg.demo',
    carKey: 'Honda|Civic|X',
    title: 'Honda Civic 1.5 VTEC Turbo, ръчна кутия, много добро състояние',
    description:
      'Автомобилът е с отлична динамика, запазен салон и добро оборудване. Разполага с камера, асистенти за сигурност, подгрев на седалките и пълен набор документи за обслужване.',
    price: 25900,
    year: 2019,
    mileage: 109000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Плевен',
    phone: '0889345123',
    images: [],
  },
];

const seedComments = [
  {
    authorEmail: 'maria.ivanova@autobg.demo',
    listingTitle: 'BMW 320d G20 M Sport, сервизна история, отлично състояние',
    content: 'Много добре изглежда. Има ли възможност за преглед в оторизиран сервиз?',
    likes: 3,
  },
  {
    authorEmail: 'georgi.dimitrov@autobg.demo',
    listingTitle: 'BMW 320d G20 M Sport, сервизна история, отлично състояние',
    content: 'Пробегът изглежда реален по описанието. Подменяни ли са накладки и дискове скоро?',
    likes: 1,
  },
  {
    authorEmail: 'ivan.petrov@autobg.demo',
    listingTitle: 'Audi A4 B9 2.0 TDI quattro, S line, панорама',
    content: 'Интересува ме дали автомобилът има два комплекта гуми и валидно каско.',
    likes: 2,
  },
  {
    authorEmail: 'maria.ivanova@autobg.demo',
    listingTitle: 'Toyota Corolla 1.8 Hybrid, икономична и надеждна',
    content: 'Колата е много икономична. Мога да изпратя допълнителни снимки и VIN при интерес.',
    likes: 4,
  },
];

const ensureDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@autobg.local';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';

  const existingAdmin = await User.findOne({ where: { role: 'admin' } });
  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  return User.create({
    username: adminUsername,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
  });
};

const seedCars = async () => {
  const count = await Car.count();
  if (count > 0) {
    return;
  }

  await Car.bulkCreate(defaultCars);
};

const ensureSeedUsers = async () => {
  const usersByEmail = {};

  for (const seedUser of seedUsers) {
    let user = await User.findOne({ where: { email: seedUser.email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(seedUser.password, 10);
      user = await User.create({
        username: seedUser.username,
        email: seedUser.email,
        password: hashedPassword,
        role: seedUser.role,
      });
    }

    usersByEmail[seedUser.email] = user;
  }

  return usersByEmail;
};

const seedMarketplaceData = async () => {
  const listingsCount = await Listing.count();
  if (listingsCount > 0) {
    return;
  }

  const usersByEmail = await ensureSeedUsers();
  const cars = await Car.findAll();
  const carsByKey = Object.fromEntries(
    cars.map((car) => [`${car.make}|${car.model}|${car.generation}`, car])
  );

  const createdListings = [];

  for (const seedListing of seedListings) {
    const seller = usersByEmail[seedListing.sellerEmail];
    const car = carsByKey[seedListing.carKey];

    if (!seller || !car) {
      continue;
    }

    const listing = await Listing.create({
      userId: seller.id,
      carId: car.id,
      title: seedListing.title,
      description: seedListing.description,
      price: seedListing.price,
      year: seedListing.year,
      mileage: seedListing.mileage,
      fuelType: seedListing.fuelType,
      transmission: seedListing.transmission,
      location: seedListing.location,
      phone: seedListing.phone,
      images: seedListing.images,
    });

    createdListings.push(listing);
  }

  const commentsCount = await Comment.count();
  if (commentsCount > 0) {
    return;
  }

  const listingsByTitle = Object.fromEntries(
    createdListings.map((listing) => [listing.title, listing])
  );

  for (const seedComment of seedComments) {
    const author = usersByEmail[seedComment.authorEmail];
    const listing = listingsByTitle[seedComment.listingTitle];

    if (!author || !listing) {
      continue;
    }

    await Comment.create({
      userId: author.id,
      listingId: listing.id,
      content: seedComment.content,
      likes: seedComment.likes,
    });
  }
};

module.exports = {
  sequelize,
  User,
  Car,
  Listing,
  Comment,
  ensureDefaultAdmin,
  seedCars,
  seedMarketplaceData,
};
