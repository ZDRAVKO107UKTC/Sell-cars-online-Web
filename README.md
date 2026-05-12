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

## Vercel + Railway deployment

This repository is now prepared for split deployment:

- frontend -> Vercel
- backend -> Railway
- database -> Railway PostgreSQL

### Frontend on Vercel

Deploy the `client` folder as the Vercel project root.

Files added for Vercel:

- `client/vercel.json` for SPA rewrites to `index.html`
- `client/.env.example` with the required frontend variables

Set these Vercel environment variables:

- `VITE_API_URL=https://your-railway-backend.up.railway.app/api`
- `VITE_UPLOADS_URL=https://your-railway-backend.up.railway.app`

Important:

- Vercel should use `client` as the Root Directory
- the React Router SPA rewrite is already configured

### Backend on Railway

Deploy the `server` folder as the Railway service root.

Files added for Railway:

- `server/railway.json` with Dockerfile build, start command and healthcheck
- `server/.env.example` with production variables

The backend now supports:

- `DATABASE_URL` for Railway PostgreSQL
- optional SSL via `DB_SSL=true`
- configurable CORS origins through `CORS_ORIGINS`
- optional Vercel preview support through `CORS_ALLOW_VERCEL_PREVIEWS`
- configurable uploads directory through `UPLOAD_DIR`

Recommended Railway variables:

- `NODE_ENV=production`
- `PORT=5000`
- `JWT_SECRET=replace_with_a_secure_value`
- `DATABASE_URL=<Railway PostgreSQL connection string>`
- `DB_SSL=true`
- `CORS_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com`
- `CORS_ALLOW_VERCEL_PREVIEWS=false`
- `UPLOAD_DIR=/data/uploads`
- `ADMIN_USERNAME=admin`
- `ADMIN_EMAIL=admin@autobg.local`
- `ADMIN_PASSWORD=change_me`

### Upload persistence on Railway

Railway application filesystems are not a replacement for persistent storage. If you want uploaded listing images to survive redeploys, attach a Railway Volume and mount it to `/data`, then set:

- `UPLOAD_DIR=/data/uploads`

Without a mounted volume, newly uploaded images may be lost on redeploy.

### Recommended deployment flow

1. Create a Railway project for the backend and PostgreSQL.
2. Set the Railway service Root Directory to `server`.
3. Add a Railway Volume mounted at `/data` if you want persistent image uploads.
4. Set the backend environment variables from `server/.env.example`.
5. Deploy the frontend on Vercel with Root Directory set to `client`.
6. Set the frontend environment variables from `client/.env.example`.
7. Add the Vercel frontend URL to `CORS_ORIGINS` on Railway.
