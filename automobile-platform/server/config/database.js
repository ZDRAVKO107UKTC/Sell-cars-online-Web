const { Sequelize } = require('sequelize');

const shouldUseSsl = () => {
  const value = String(process.env.DB_SSL || '').toLowerCase();

  if (value === 'true' || value === '1' || value === 'require') {
    return true;
  }

  return Boolean(process.env.DATABASE_URL && process.env.NODE_ENV === 'production');
};

const dialectOptions = shouldUseSsl()
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : undefined;

const baseOptions = {
  dialect: 'postgres',
  logging: false,
  dialectOptions,
};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, baseOptions)
  : new Sequelize(
      process.env.DB_NAME || 'automobile_platform',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres123',
      {
        ...baseOptions,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
      }
    );

module.exports = sequelize;
