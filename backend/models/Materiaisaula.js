import { DataTypes } from 'sequelize'
import db from '../db/db.js'
import Disciplinas from './Disciplinas.js'

const Materiaisaula = db.define('materiaisaula', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING(255),
    },
    arquivo_url: {
        type: DataTypes.STRING(1024),
    },
    disciplina_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Disciplinas,
            key: "ID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }
}, {
    tableName: 'materiaisaula',
    timestamps: false, // <<< DESATIVA createdAt e updatedAt
})

Materiaisaula.belongsTo(Disciplinas, {
    foreignKey: "disciplina_id",
})

Disciplinas.hasMany(Materiaisaula, {
    foreignKey: "disciplina_id",
})

export default Materiaisaula