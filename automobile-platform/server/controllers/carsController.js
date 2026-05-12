const { fn, col } = require('sequelize');
const { Car } = require('../models');
const { validateCarPayload } = require('../utils/validation');

const getCars = async (req, res) => {
  try {
    const where = {};

    if (req.query.make) {
      where.make = req.query.make;
    }

    if (req.query.model) {
      where.model = req.query.model;
    }

    const cars = await Car.findAll({
      where,
      order: [
        ['make', 'ASC'],
        ['model', 'ASC'],
        ['generation', 'ASC'],
      ],
    });

    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load cars.' });
  }
};

const getCarMakes = async (_req, res) => {
  try {
    const makes = await Car.findAll({
      attributes: [[fn('DISTINCT', col('make')), 'make']],
      order: [['make', 'ASC']],
      raw: true,
    });

    return res.status(200).json(makes.map((item) => item.make));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load car makes.' });
  }
};

const getCarModels = async (req, res) => {
  try {
    const where = {};
    if (req.query.make) {
      where.make = req.query.make;
    }

    const models = await Car.findAll({
      where,
      attributes: [[fn('DISTINCT', col('model')), 'model']],
      order: [['model', 'ASC']],
      raw: true,
    });

    return res.status(200).json(models.map((item) => item.model));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load car models.' });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load car.' });
  }
};

const createCar = async (req, res) => {
  try {
    const validation = validateCarPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const {
      make,
      model,
      generation,
      yearFrom,
      yearTo,
      engine,
      horsepower,
      fuelType,
      transmission,
      drivetrain,
      bodyType,
    } = validation.values;

    const existingCar = await Car.findOne({
      where: {
        make,
        model,
        generation,
        yearFrom,
        yearTo,
        engine,
      },
    });

    if (existingCar) {
      return res.status(409).json({ message: 'This car variant already exists.' });
    }

    const car = await Car.create({
      make,
      model,
      generation,
      yearFrom,
      yearTo,
      engine,
      horsepower,
      fuelType,
      transmission,
      drivetrain,
      bodyType,
    });

    return res.status(201).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create car.' });
  }
};

module.exports = {
  getCars,
  getCarMakes,
  getCarModels,
  getCarById,
  createCar,
};
