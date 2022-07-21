const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");
const bcrpyt = require('bcrypt');

const User = connDatabase.define('User', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    badgeId: {
        type: DataTypes.STRING(8),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue('password', bcrpyt.hashSync(value, 10))
        }
    },
    name: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
            isEmail: true
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

module.exports = User;