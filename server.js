const express = require("express");
const app = express();
require("dotenv").config();

const db = require("./config/db");

// Load models & associations
require("./models/User");
require("./models/Event");
require("./models/Registration");
require("./models/associations");

app.use(express.json());

// Simple route
app.get("/", (req, res) => res.send("API is working"));

// Routes
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
    res.status(err.status || 500).send({
        success:false,
		message: err.message || "Internal Server Error",
	});
});

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Server running on port ${port}`));

db.authenticate()
	.then(() => {
		console.log("Database connection established");
		return db.sync({ alter: true });
	})
	.then(() => {
		console.log("All models are synced");
	})
	.catch((err) => {
		console.error("Database initialization error:", err);
		process.exit(1);
	});
