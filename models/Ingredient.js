import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;

const IngredientModel = db.define('ingredient',{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  measure: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
  freezeTableName:true,
  schema: 'public',
  timestamps: false,
});

(async () => {
  await db.sync();
})();

export default IngredientModel;