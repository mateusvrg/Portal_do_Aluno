import { DataTypes } from 'sequelize'
import db from '../db/db.js'
import Aluno from './Aluno.js'
import Disciplina from './Disciplinas.js'

const Frequencia = db.define('frequencia', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    presente: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    aluno_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        references: {
            model: Disciplina,
            key: "ID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }
}, {
    tableName: 'frequencia',
    timestamps: false, // <<< DESATIVA createdAt e updatedAt
})

Frequencia.belongsTo(Disciplina, {
    foreignKey: "disciplina_id",
})

Frequencia.belongsTo(Aluno, {
    foreignKey: "aluno_id",
})

Disciplina.hasMany(Frequencia, {
    foreignKey: "disciplina_id",
})

Aluno.hasMany(Frequencia, {
    foreignKey: "aluno_id",
})

export default Frequencia