import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Group from './Group.js';
import MealIngredient from './MealIngredients.js';

const { DataTypes } = Sequelize;

const GroupMeal = db.define('group_meals', {
  groupid: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  },
  mealid: {
    type: DataTypes.INTEGER,
    references: {
      model: MealIngredient,
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  schema: 'public',
  timestamps: false,
});

export default GroupMeal;