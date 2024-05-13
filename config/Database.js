import { Sequelize } from "sequelize";
import pg from "pg"

const db = new Sequelize('postgres', "postgres", "changeme", {
    host: "postgres_container",
    dialect: "postgres",
    port: 5432,
    dialectModule: pg,
  }); 

export default db;