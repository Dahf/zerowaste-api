import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;
import Ingredient from "./Ingredient.js";
import Meal from "./Meals.js";

const MealIngredient = db.define('mealingredient', {
  mealid: {
      type: DataTypes.INTEGER,
      references: {
          model: Meal,
          key: 'id'
      }
  },
  ingredientid: {
      type: DataTypes.INTEGER,
      references: {
          model: Ingredient,
          key: 'id'
      }
  }
}, {
  freezeTableName: true,
  schema: 'public',
  timestamps: false,
});
(async () => {
  await db.sync();
})();

export default MealIngredient;