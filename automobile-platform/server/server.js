require('dotenv').config();
const app = require('./app');
const {
  sequelize,
  ensureDefaultAdmin,
  seedCars,
  seedMarketplaceData,
} = require('./models');

const port = Number(process.env.PORT) || 5000;

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const connectWithRetry = async (attempt = 1) => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    if (attempt >= 15) {
      throw error;
    }

    console.log(`Database connection failed. Retrying (${attempt}/15)...`);
    await wait(4000);
    await connectWithRetry(attempt + 1);
  }
};

const startServer = async () => {
  try {
    await connectWithRetry();
    await sequelize.sync();
    await ensureDefaultAdmin();
    await seedCars();
    await seedMarketplaceData();

    app.listen(port, () => {
      console.log(`AutoBG API is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
