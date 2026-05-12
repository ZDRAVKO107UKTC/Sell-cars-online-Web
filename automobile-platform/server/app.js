const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const carsRoutes = require('./routes/carsRoutes');
const listingsRoutes = require('./routes/listingsRoutes');
const { listingCommentsRouter, commentsRouter } = require('./routes/commentsRoutes');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/listings', listingCommentsRouter);
app.use('/api/listings', listingsRoutes);
app.use('/api/comments', commentsRouter);

app.use((error, _req, res, _next) => {
  if (error.message === 'Only image files are allowed.') {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Each image must be up to 5MB.' });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ message: 'You can upload up to 8 images.' });
  }

  return res.status(500).json({ message: 'Unexpected server error.' });
});

module.exports = app;
