import { Sequelize } from "sequelize";
import pg from "pg"

const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    port: 5432,
    dialectModule: pg,
    logging: console.log,
  }); 

export default db;