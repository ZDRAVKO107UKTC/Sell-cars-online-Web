# AutoBG

AutoBG е full-stack платформа за автомобилни обяви, изградена с React 18, Express, Sequelize, PostgreSQL и Docker. Проектът поддържа регистрация и вход, публикуване и управление на автомобилни обяви, качване на снимки, филтриране и сортиране, коментари и админ панел за управление на автомобилните модели.

## Технологии

- Frontend: React 18, React Router, Axios, Vite, plain CSS
- Backend: Node.js 20, Express.js, Sequelize ORM, PostgreSQL, JWT, Bcrypt, Multer
- DevOps: Docker, Docker Compose

## Структура

```text
automobile-platform/
├── client/
├── server/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Стартиране

Нужен е само Docker Desktop или друга Docker среда с `docker compose`.

```bash
docker compose up --build
```

След стартиране:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)
- PostgreSQL: `localhost:5432`

## Default admin

При първо стартиране backend-ът създава автоматично admin потребител:

- Email: `admin@autobg.local`
- Password: `admin12345`

## Основни възможности

- Регистрация, вход и редакция на профил
- JWT защита на частните операции
- Създаване, редакция и изтриване на собствени обяви
- Качване на до 8 снимки на обява
- Филтри по марка, модел, цена, година, гориво, скоростна кутия и пробег
- Коментари под обяви с редакция, изтриване и харесване
- Админ панел за добавяне на нови записи в `cars`
- Автоматично seed-нати начални автомобилни модели за бърз старт

## API endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`

### Listings

- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`
- `GET /api/listings/user/:userId`

Поддържани query параметри за `GET /api/listings`:

- `make`
- `model`
- `priceMin`
- `priceMax`
- `yearMin`
- `yearMax`
- `fuelType`
- `transmission`
- `mileageMin`
- `mileageMax`
- `sort=latest|price_asc|price_desc|year_desc`
- `limit`

### Comments

- `GET /api/listings/:id/comments`
- `POST /api/listings/:id/comments`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`
- `POST /api/comments/:id/like`

Допълнителен admin endpoint:

- `GET /api/comments`

### Cars

- `GET /api/cars`
- `GET /api/cars/makes`
- `GET /api/cars/models?make=BMW`
- `GET /api/cars/:id`
- `POST /api/cars`

## Docker услуги

### PostgreSQL

- Image: `postgres:16-alpine`
- Database: `automobile_platform`
- User: `postgres`
- Password: `postgres123`

### Backend

- Port: `5000`
- Database host: `db`
- Uploads се пазят в Docker volume

### Frontend

- Port: `3000`
- Използва `http://localhost:5000/api` за API заявки

## Забележки

- Базата се създава и синхронизира автоматично чрез Sequelize при стартиране на backend контейнера.
- Снимките се съхраняват в `server/uploads` и се публикуват през `http://localhost:5000/uploads/...`.
- Проектът е изцяло на JavaScript и не използва TypeScript или fake backend.
