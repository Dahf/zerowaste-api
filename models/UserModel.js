import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vorname:{
        type: DataTypes.STRING
    },
    nachname:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    rank:{
        type: DataTypes.INTEGER
    },
    password:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type: DataTypes.TEXT
    },
    confirmed:{
        type: DataTypes.BOOLEAN
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default Users;