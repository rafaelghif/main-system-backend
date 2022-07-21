const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const InspectionDetail = connDatabase.define('InspectionDetail', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    status: {
        type: DataTypes.ENUM('Issued', 'Verified', 'Rejected'),
        allowNull: false,
        defaultValue: 'Issued'
    },
    verifiedBy: {
        type: DataTypes.STRING(8),
        allowNull: true,
    },
    verifiedAt: {
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

module.exports = InspectionDetail