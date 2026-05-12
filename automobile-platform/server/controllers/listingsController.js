const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { Listing, Car, User, Comment } = require('../models');
const { uploadDirectory } = require('../config/uploads');

const parseImagesField = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const removeUploadedFiles = (images = []) => {
  images.forEach((imagePath) => {
    const normalizedPath = path.join(uploadDirectory, path.basename(imagePath));
    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
    }
  });
};

const buildListingInclude = (withComments = false) => {
  const include = [
    {
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'email', 'role'],
    },
    {
      model: Car,
      as: 'car',
    },
  ];

  if (withComments) {
    include.push({
      model: Comment,
      as: 'comments',
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role'],
        },
      ],
      separate: true,
      order: [['createdAt', 'DESC']],
    });
  }

  return include;
};

const getListings = async (req, res) => {
  try {
    const where = {};
    const carWhere = {};
    const include = buildListingInclude();

    if (req.query.priceMin) {
      where.price = { ...(where.price || {}), [Op.gte]: Number(req.query.priceMin) };
    }

    if (req.query.priceMax) {
      where.price = { ...(where.price || {}), [Op.lte]: Number(req.query.priceMax) };
    }

    if (req.query.yearMin) {
      where.year = { ...(where.year || {}), [Op.gte]: Number(req.query.yearMin) };
    }

    if (req.query.yearMax) {
      where.year = { ...(where.year || {}), [Op.lte]: Number(req.query.yearMax) };
    }

    if (req.query.mileageMin) {
      where.mileage = { ...(where.mileage || {}), [Op.gte]: Number(req.query.mileageMin) };
    }

    if (req.query.mileageMax) {
      where.mileage = { ...(where.mileage || {}), [Op.lte]: Number(req.query.mileageMax) };
    }

    if (req.query.fuelType) {
      where.fuelType = req.query.fuelType;
    }

    if (req.query.transmission) {
      where.transmission = req.query.transmission;
    }

    if (req.query.make) {
      carWhere.make = req.query.make;
    }

    if (req.query.model) {
      carWhere.model = req.query.model;
    }

    if (Object.keys(carWhere).length > 0) {
      include[1] = {
        ...include[1],
        where: carWhere,
        required: true,
      };
    }

    const sortMap = {
      latest: [['createdAt', 'DESC']],
      price_asc: [['price', 'ASC']],
      price_desc: [['price', 'DESC']],
      year_desc: [['year', 'DESC']],
    };

    const order = sortMap[req.query.sort] || sortMap.latest;

    const listings = await Listing.findAll({
      where,
      include,
      order,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    return res.status(200).json(listings);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load listings.' });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: buildListingInclude(true),
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    return res.status(200).json(listing);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load listing.' });
  }
};

const createListing = async (req, res) => {
  try {
    const {
      carId,
      title,
      description,
      price,
      year,
      mileage,
      fuelType,
      transmission,
      location,
      phone,
    } = req.body;

    if (
      !carId ||
      !title ||
      !description ||
      !price ||
      !year ||
      !mileage ||
      !fuelType ||
      !transmission ||
      !location ||
      !phone
    ) {
      return res.status(400).json({ message: 'All listing fields are required.' });
    }

    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ message: 'Selected car was not found.' });
    }

    const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    const listing = await Listing.create({
      userId: req.user.id,
      carId: Number(carId),
      title,
      description,
      price: Number(price),
      year: Number(year),
      mileage: Number(mileage),
      fuelType,
      transmission,
      location,
      phone,
      images: uploadedImages,
    });

    const createdListing = await Listing.findByPk(listing.id, {
      include: buildListingInclude(),
    });

    return res.status(201).json(createdListing);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create listing.' });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (req.user.role !== 'admin' && listing.userId !== req.user.id) {
      return res.status(403).json({ message: 'You cannot edit this listing.' });
    }

    const {
      carId,
      title,
      description,
      price,
      year,
      mileage,
      fuelType,
      transmission,
      location,
      phone,
      existingImages,
    } = req.body;

    if (carId) {
      const car = await Car.findByPk(carId);
      if (!car) {
        return res.status(404).json({ message: 'Selected car was not found.' });
      }
      listing.carId = Number(carId);
    }

    const keptImages = parseImagesField(existingImages);
    const newImages = (req.files || []).map((file) => `/uploads/${file.filename}`);
    const removedImages = (listing.images || []).filter((image) => !keptImages.includes(image));

    if (removedImages.length > 0) {
      removeUploadedFiles(removedImages);
    }

    listing.title = title ?? listing.title;
    listing.description = description ?? listing.description;
    listing.price = price ? Number(price) : listing.price;
    listing.year = year ? Number(year) : listing.year;
    listing.mileage = mileage ? Number(mileage) : listing.mileage;
    listing.fuelType = fuelType ?? listing.fuelType;
    listing.transmission = transmission ?? listing.transmission;
    listing.location = location ?? listing.location;
    listing.phone = phone ?? listing.phone;
    listing.images = [...keptImages, ...newImages];

    await listing.save();

    const updatedListing = await Listing.findByPk(listing.id, {
      include: buildListingInclude(),
    });

    return res.status(200).json(updatedListing);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update listing.' });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (req.user.role !== 'admin' && listing.userId !== req.user.id) {
      return res.status(403).json({ message: 'You cannot delete this listing.' });
    }

    removeUploadedFiles(listing.images || []);
    await listing.destroy();

    return res.status(200).json({ message: 'Listing deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete listing.' });
  }
};

const getListingsByUser = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { userId: Number(req.params.userId) },
      include: buildListingInclude(),
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(listings);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load user listings.' });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByUser,
};
