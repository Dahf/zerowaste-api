import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Group from './Group.js';
import Product from './Products.js';

const { DataTypes } = Sequelize;

const GroupProduct = db.define('group_products', {
  groupid: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  },
  productid: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  schema: 'public',
  timestamps: false,
});

export default GroupProduct;