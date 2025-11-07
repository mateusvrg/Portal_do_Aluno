import { DataTypes } from "sequelize";
import db from "../db/db.js";
import User from "./User.js";

const Avisos = db.define(
  "avisos",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    autor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "ID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data_postagem: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "avisos",
    timestamps: false, // <<< DESATIVA createdAt e updatedAt
  }
);

Avisos.belongsTo(User, {
  foreignKey: "autor_id",
});

User.hasMany(Avisos, {
  foreignKey: "autor_id",
});

export default Avisos;
