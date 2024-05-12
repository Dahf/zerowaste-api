const { DataTypes } = require("sequelize");

const IngredientModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  measure: {
    type: DataTypes.STRING,
    allowNull: false
  }
};

module.exports = {
  initialise: (sequelize) => {
    const Ingredient = sequelize.define("ingredient", IngredientModel);
    return Ingredient;
  }
};