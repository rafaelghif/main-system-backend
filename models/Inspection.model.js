const { connDatabase } = require("../config/database.config");
const { DataTypes } = require("sequelize");

const Inspection = connDatabase.define('Inspection', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
})

module.exports = Inspection