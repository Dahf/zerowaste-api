import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Group from "./Group.js";
import Product from "./Products.js";
import MealModel from "./Meals.js";
const { DataTypes } = Sequelize;

const MealProduct = db.define('mealproduct', {
  mealId: {
    type: DataTypes.INTEGER,
    references: {
      model: MealModel,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  },
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  schema: 'public',
});

export default MealProduct;