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

Group.belongsToMany(Product, { through: GroupProduct });
Product.belongsToMany(Group, { through: GroupProduct });

Group.belongsToMany(MealModel, { through: GroupMeal });
MealModel.belongsToMany(Group, { through: GroupMeal });


export default Group;