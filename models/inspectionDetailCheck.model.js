const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const InspectionDetailCheck = connDatabase.define('InspectionDetailCheck', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Issue','Approve', 'Reject'),
        allowNull: false,
        defaultValue: 'Issue'
    }
})

module.exports = InspectionDetailCheck