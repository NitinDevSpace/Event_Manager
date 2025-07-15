const { DataTypes } = require("sequelize");
const db = require("../config/db");
const Registration = require("./Registration");

const User = db.define("User", {
    id: {
        type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
        type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
        type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
});


module.exports = User;
