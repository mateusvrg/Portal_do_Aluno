import { DataTypes } from "sequelize";
import db from "../db/db.js";
import ProfessoresTurmas from "./ProfessoresTurmas.js";

const Turma = db.define(
  "turmas",
  {
    ano_letivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome_turma: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "turmas",
    timestamps: false, // <<< DESATIVA createdAt e updatedAt
  }
);

export default Turma;
