const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const Inspection = connDatabase.define('Inspection', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    inspectionDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    inspectionDateTemp: {
        type: DataTypes.DATE,
        allowNull: true
    },
    approveDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Verified', 'Reject'),
        allowNull: true
    },
    statusTemp: {
        type: DataTypes.ENUM('Need Inspection', 'Waiting Verify','Verified'),
        defaultValue: 'Need Inspection'
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

module.exports = Inspection