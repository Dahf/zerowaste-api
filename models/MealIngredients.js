import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;
import Ingredient from "./Ingredient.js";
import Meal from "./Meals.js";

const MealIngredient = db.define('MealIngredient', {
  mealId: {
      type: Sequelize.INTEGER,
      references: {
          model: Meal,
          key: 'id'
      }
  },
  ingredientId: {
      type: Sequelize.INTEGER,
      references: {
          model: Ingredient,
          key: 'id'
      }
  }
}, {
  freezeTableName: true,
});
(async () => {
  await db.sync();
})();

export default MealIngredient;