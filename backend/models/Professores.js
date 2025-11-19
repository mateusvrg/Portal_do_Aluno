import { DataTypes } from "sequelize";
import db from "../db/db.js";
import User from "./User.js";
import ProfessoresTurmas from "./ProfessoresTurmas.js";

const Professores = db.define(
  "professores",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    departamento: {
      type: DataTypes.STRING(100),
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
    tableName: "professores",
    timestamps: false, // <<< DESATIVA createdAt e updatedAt
  }
);

Professores.belongsTo(User, {
  foreignKey: "usuario_id",
});

User.hasMany(Professores, {
  foreignKey: "usuario_id",
});

Professores.hasMany(ProfessoresTurmas, {
  foreignKey: "professor_id",
});

export default Professores;
