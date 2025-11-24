import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Professores from "./Professores.js";

const Disciplinas = db.define(
  "disciplinas",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome_disciplina: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    professor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Professores,
        key: "ID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "disciplinas",
    timestamps: false, // <<< DESATIVA createdAt e updatedAt
  }
);

Disciplinas.belongsTo(Professores, {
  foreignKey: "professor_id",
});

Professores.hasMany(Disciplinas, {
  foreignKey: "professor_id",
});

export default Disciplinas;
