const { DataTypes } = require("sequelize");

const MealModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  servingSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true // Kalorien sind optional
  },
  fat: {
    type: DataTypes.DECIMAL(5, 2), // Gramm Fett
    allowNull: true
  },
  carbohydrates: {
    type: DataTypes.DECIMAL(5, 2), // Gramm Kohlenhydrate
    allowNull: true
  },
  protein: {
    type: DataTypes.DECIMAL(5, 2), // Gramm Protein
    allowNull: true
  },
  fiber: {
    type: DataTypes.DECIMAL(5, 2), // Gramm Ballaststoffe
    allowNull: true
  },
  sugar: {
    type: DataTypes.DECIMAL(5, 2), // Gramm Zucker
    allowNull: true
  },
  sodium: {
    type: DataTypes.INTEGER, // Milligramm Natrium
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
};

module.exports = {
    initialise: (sequelize) => {
        const Meal = sequelize.define("meal", MealModel);
        const Ingredient = require('./Ingredient').initialise(sequelize);

        // Definieren der 1-zu-n-Beziehung
        Meal.hasMany(Ingredient, { as: 'ingredients' });
        Ingredient.belongsTo(Meal, { foreignKey: 'mealId', as: 'meal' });

        return Meal;
    },

  createMeal: (meal) => {
    return this.model.create(meal);
  },

  findMeal: (query) => {
    return this.model.findOne({
      where: query,
    });
  },

  updateMeal: (query, updatedValue) => {
    return this.model.update(updatedValue, {
      where: query,
    });
  },

  findAllMeals: (query) => {
    return this.model.findAll({
      where: query
    });
  },

  deleteMeal: (query) => {
    return this.model.destroy({
      where: query
    });
  }
};