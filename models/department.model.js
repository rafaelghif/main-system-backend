const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const Department = connDatabase.define('Department', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    updatedBy: {
        type: DataTypes.STRING(8),
        allowNull: false
    }
})

module.exports = Department;