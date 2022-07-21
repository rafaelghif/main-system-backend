const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const CheckerPart = connDatabase.define('CheckerPart', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    serialNumber: {
        type: DataTypes.STRING(30),
        allowNull: true,
    },
    changeDate: {
        type: DataTypes.DATE,
        allowNull: true,
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

module.exports = CheckerPart