import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Aluno from "./Aluno.js";
import Disciplinas from "./Disciplinas.js";

const Matriculas = db.define(
  "matriculas",
  {
    aluno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Aluno,
        key: "ID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    disciplina_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
       model: Disciplinas,
       key: "ID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "matriculas",
    timestamps: false,
  }
);

Matriculas.belongsTo(Aluno, {
 foreignKey: "aluno_id",
});

Matriculas.belongsTo(Disciplinas, {
 foreignKey: "disciplina_id",
});

Aluno.hasMany(Matriculas, {
  foreignKey: "aluno_id",
});

Disciplinas.hasMany(Matriculas, {
  foreignKey: "disciplina_id",
});

export default Matriculas;
