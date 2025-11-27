import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Disciplinas from "./Disciplinas.js";

const Horarios = db.define(
  "horarios",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    disciplina_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Disciplinas,
        key: "ID",
      },
    },
    horario_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    horario_fim: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    dia_semana: {
      type: DataTypes.ENUM('Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'),
      allowNull: false,
    },
  },
  {
    tableName: "horarios",
    timestamps: false,
  }
);

Horarios.belongsTo(Disciplinas, {
  foreignKey: "disciplina_id",
});

Disciplinas.hasMany(Horarios, {
  foreignKey: "disciplina_id",
});

export default Horarios;
