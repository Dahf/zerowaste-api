import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Group from './Group.js';
import Product from './Products.js';

const { DataTypes } = Sequelize;

const GroupProduct = db.define('group_products', {
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  }
}, {
  freezeTableName: true
});

export default GroupProduct;