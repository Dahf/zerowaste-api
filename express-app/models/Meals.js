import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const MealModel = db.define('meals',{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  servingSize: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true // Kalorien sind optional
  },
  fat: {
    type: DataTypes.INTEGER, // Gramm Fett
    allowNull: true
  },
  carbohydrates: {
    type: DataTypes.INTEGER, // Gramm Kohlenhydrate
    allowNull: true
  },
  protein: {
    type: DataTypes.INTEGER, // Gramm Protein
    allowNull: true
  },
  energy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sugar: {
    type: DataTypes.INTEGER, // Gramm Zucker
    allowNull: true
  },
  sodium: {
    type: DataTypes.INTEGER, // Milligramm Natrium
    allowNull: true
  },
},{
  freezeTableName:true
});

(async () => {
  await db.sync();
})();

export default MealModel;