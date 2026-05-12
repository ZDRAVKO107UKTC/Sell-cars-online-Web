const express = require('express');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByUser,
} = require('../controllers/listingsController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getListings);
router.get('/user/:userId', getListingsByUser);
router.get('/:id', getListingById);
router.post('/', authenticate, upload.array('images', 8), createListing);
router.put('/:id', authenticate, upload.array('images', 8), updateListing);
router.delete('/:id', authenticate, deleteListing);

module.exports = router;
