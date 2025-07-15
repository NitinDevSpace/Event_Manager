const router = require("express").Router();
const Event = require("../models/Event");
const {
	createEvent,
	getEvent,
	eventStats,
	registerUser,
	cancelRegistration,
	upcomingEvents,
} = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/upcoming", upcomingEvents);
router.get("/:id", getEvent);
router.get("/:id/stats", eventStats);
router.post("/:id/register", registerUser);
router.delete("/:id/register/:userId", cancelRegistration);

module.exports = router;
