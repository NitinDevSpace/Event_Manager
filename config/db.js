require('dotenv').config();
const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DB_URL, {
	dialect: "postgres",
	dialectOptions: {
		ssl: {
			required: true,
			rejectUnauthorized: false,
		},
	},
});

module.exports = db;