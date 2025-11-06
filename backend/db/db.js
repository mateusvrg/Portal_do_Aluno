import { Sequelize } from "sequelize";
import dotenv from "dotenv";
// Logger
import Logger from "./logger";
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    Logger.info("DB Connected");
  } catch (err) {
    Logger.error("Could not connect to db");
    Logger.error(`Error: ${e}`);
  }
}

connectDB();

export default sequelize;
