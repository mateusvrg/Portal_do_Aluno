import { DataTypes } from "sequelize";
import db from "../db/db.js";

const User = db.define(
  "usuarios",
  {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("aluno", "professor", "admin"),
      allowNull: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false, // <<< DESATIVA createdAt e updatedAt
  }
);

export default User;
