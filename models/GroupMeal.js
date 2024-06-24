import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Group from './Group.js';
import Meal from './Meal.js';

const { DataTypes } = Sequelize;

const GroupMeal = db.define('group_meals', {
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  },
  mealId: {
    type: DataTypes.INTEGER,
    references: {
      model: Meal,
      key: 'id'
    }
  }
}, {
  freezeTableName: true
});

export default GroupMeal;