import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Product from './Products.js';
import MealModel from './Meals.js';
import GroupProduct from './GroupProduct.js';
import GroupMeal from './GroupMeal.js';

const { DataTypes } = Sequelize;

const Group = db.define('groups', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true
});

(async () => {
  await db.sync();
})();

export default Group;