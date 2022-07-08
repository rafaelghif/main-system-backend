const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");
const User = require("./user.model");
const Role = require("./role.model");

const UserRole = connDatabase.define('UserRole', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    UserId: {
        type: DataTypes.CHAR(36),
        references: {
            model: User,
            key: 'id'
        }
    },
    RoleId: {
        type: DataTypes.CHAR(36),
        references: {
            model: Role,
            key: 'id'
        }
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

module.exports = UserRole