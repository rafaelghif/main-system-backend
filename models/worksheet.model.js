const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const Worksheet = connDatabase.define('Worksheet', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    revision: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('Created', 'Issued', 'Approved', 'Rejected'),
        defaultValue: 'Created'
    },
    approvedBy: {
        type: DataTypes.STRING(8),
        allowNull: true
    },
    approveAt: {
        type: DataTypes.DATE,
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

module.exports = Worksheet;