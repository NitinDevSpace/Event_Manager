const router = require("express").Router();
const getEvents = require("../controllers/userController");

router.get("/:id/events", getEvents);

module.exports = router;
