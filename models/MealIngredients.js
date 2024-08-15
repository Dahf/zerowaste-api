import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;
import Ingredient from "./Ingredient.js";
import Meal from "./Meals.js";

const MealIngredient = db.define('mealingredient', {
  mealId: {
      type: DataTypes.INTEGER,
      references: {
          model: Meal,
          key: 'id'
      }
  },
  ingredientId: {
      type: DataTypes.INTEGER,
      references: {
          model: Ingredient,
          key: 'id'
      }
  }
}, {
  freezeTableName: true,
  schema: 'public',
});
(async () => {
  await db.sync();
})();

export default MealIngredient;