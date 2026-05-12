const express = require('express');
const {
  getCars,
  getCarMakes,
  getCarModels,
  getCarById,
  createCar,
} = require('../controllers/carsController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCars);
router.get('/makes', getCarMakes);
router.get('/models', getCarModels);
router.get('/:id', getCarById);
router.post('/', authenticate, requireAdmin, createCar);

module.exports = router;
