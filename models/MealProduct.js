import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Group from "./Group.js";
import Product from "./Products.js";
import MealModel from "./Meals.js";
const { DataTypes } = Sequelize;

const MealProduct = db.define('mealproduct', {
  mealid: {
    type: DataTypes.INTEGER,
    references: {
      model: MealModel,
      key: 'id'
    }
  },
  productid: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  },
  groupid: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: false,
  schema: 'public',
});

export default MealProduct;