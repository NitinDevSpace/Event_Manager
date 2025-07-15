const { DataTypes } = require("sequelize");
const db = require("../config/db");
const Registration = require("./Registration");

const Event = db.define("Event", {
    id: {
        type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	title: {
        type: DataTypes.STRING,
		allowNull: false,
	},
	location: {
        type: DataTypes.STRING,
		allowNull: false,
	},
	dateTime: {
        type: DataTypes.DATE,
		allowNull: false,
	},
	capacity: {
        type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
            min: 1,
			max: 1000,
		},
	},
});

module.exports = Event;
