import { Sequelize } from "sequelize";
import config from "./env";

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "mysql",
    logging: config.app.env === "development" ? console.log : false,
    sync: {
      alter: false, // Disable sync alter as requested
      force: false,
    },
    define: {
      timestamps: true, // Enable timestamps by default
      underscored: false, // Use camelCase for database columns
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
