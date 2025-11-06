import { DataTypes } from "sequelize";
import db from "../db/db.js";
import User from "./User.js";
import Turma from "./Turma.js";

const Aluno = db.define(
  "alunos",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    matricula: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    turma_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Turma,
        key: "ID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "ID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "alunos",
    timestamps: false, // <<< DESATIVA createdAt e updatedAt
  }
);

Aluno.belongsTo(Turma, {
  foreignKey: "turma_id",
});

Aluno.belongsTo(User, {
  foreignKey: "usuario_id",
});

Turma.hasMany(Aluno, {
  foreignKey: "turma_id",
});

User.hasOne(Aluno, {
  foreignKey: "usuario_id",
});

export default Aluno;
