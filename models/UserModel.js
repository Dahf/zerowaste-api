import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Users = db.define('users', {
    kndnr: {
        type: DataTypes.INTEGER
    },
    anrede:{
        type: DataTypes.STRING
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
    straße:{
        type: DataTypes.STRING
    },
    hausnummer:{
        type: DataTypes.INTEGER
    },
    plz:{
        type: DataTypes.INTEGER
    },
    ort:{
        type: DataTypes.STRING
    },
    land:{
        type: DataTypes.STRING
    },
    geburtstag:{
        type: DataTypes.DATE
    },
    phone:{
        type: DataTypes.BIGINT
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