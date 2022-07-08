const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const Checker = connDatabase.define('Checker', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    regNo: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: false,
    },
    checkerName: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mfgNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    receivedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    inspectionRange: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ipAddress: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    operatingSystem: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    remarks: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    qrCode: {
        type: DataTypes.STRING,
        allowNull: true
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

module.exports = Checker