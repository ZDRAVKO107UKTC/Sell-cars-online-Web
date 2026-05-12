const { DataTypes, Model } = require('sequelize');

class Car extends Model {}

module.exports = (sequelize) => {
  Car.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      make: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      generation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      yearFrom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'year_from',
      },
      yearTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'year_to',
      },
      engine: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      horsepower: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fuelType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fuel_type',
      },
      transmission: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      drivetrain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bodyType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'body_type',
      },
    },
    {
      sequelize,
      modelName: 'Car',
      tableName: 'cars',
      timestamps: true,
    }
  );

  return Car;
};
