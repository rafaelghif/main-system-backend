const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const WorksheetDetailTemp = connDatabase.define('WorksheetDetailTemp', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    inspectionItem: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    inspectionPicture: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    specialChange: {
        type: DataTypes.INTEGER,
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

module.exports = WorksheetDetailTemp;