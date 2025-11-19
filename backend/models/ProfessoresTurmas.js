import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Turma from "./Turma.js";
import Professores from "./Professores.js";

const ProfessoresTurmas = db.define(
  "professores_turmas",
  {
    professor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
       model: Professores,
       key: "ID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    turma_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
       model: Turma,
       key: "ID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "professores_turmas",
    timestamps: false,
  }
);

ProfessoresTurmas.belongsTo(Professores, {
 foreignKey: "professor_id",
});

ProfessoresTurmas.belongsTo(Turma, {
 foreignKey: "turma_id",
});

Professores.hasMany(ProfessoresTurmas, {
  foreignKey: "professor_id",
});

Turma.hasMany(ProfessoresTurmas, {
  foreignKey: "turma_id",
});

export default ProfessoresTurmas;
