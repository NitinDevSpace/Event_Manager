const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");

const createEvent = asyncHandler(async (req, res) => {
	const { title, location, dateTime, capacity } = req.body;

	if (!title || !location || !dateTime || !capacity) {
		return res.status(400).json({ message: "All fields are required." });
	}

	if (new Date(dateTime) < new Date()) {
		return res.status(400).send({
			success: false,
			message: "Cannot register for past events",
		});
	}

	if (capacity < 1 || capacity > 1000) {
		return res
			.status(400)
			.json({ message: "Capacity must be between 1 and 1000." });
	}

	const newEvent = await Event.create({
		title,
		location,
		dateTime,
		capacity,
	});

	res.status(201).json({
		success: true,
		message: "Event created successfully",
		eventId: newEvent.id,
	});
});

const getEvent = asyncHandler(async (req, res) => {
	const event = await Event.findByPk(req.params.id, {
		include: {
			model: require("../models/User"),
			attributes: ["id", "name", "email"],
			through: { attributes: [] },
		},
	});

	if (!event) {
		return res.status(404).send({
			success: false,
			message: "Event not found.",
		});
	}

	res.status(200).json(event);
});

const registerUser = asyncHandler(async (req, res) => {
	const eventId = req.params.id;
	const { userId } = req.body;

	// Start a transaction
	await require("../config/db").transaction(async (t) => {
		// 1. Check if event exists and lock the row
		const event = await Event.findByPk(eventId, { lock: t.LOCK.UPDATE, transaction: t });
		if (!event) {
			return res.status(404).send({
				success: false,
				message: "Event not found",
			});
		}

		// 2. Check if user exists
		const user = await User.findByPk(userId, { transaction: t });
		if (!user) {
			return res.status(404).send({
				success: false,
				message: "User not found",
			});
		}

		// 3. Check if already registered
		const isRegistered = await Registration.findOne({
			where: { EventId: eventId, UserId: userId },
			transaction: t,
		});
		if (isRegistered) {
			return res.status(400).send({
				success: false,
				message: "User is already registered for this event",
			});
		}

		// 4. Check if event is full (safe inside transaction)
		const registrationCount = await Registration.count({
			where: { EventId: eventId },
			transaction: t,
		});
		if (registrationCount >= event.capacity) {
			return res.status(400).send({
				success: false,
				message: "Event is full",
			});
		}

		// 5. Check if event date is in the future
		if (new Date(event.dateTime) < new Date()) {
			return res.status(400).send({
				success: false,
				message: "Cannot register for past events",
			});
		}

		// 6. Create registration
		await Registration.create(
			{
				EventId: eventId,
				UserId: userId,
			},
			{ transaction: t }
		);

		res.status(201).send({
			success: true,
			message: "User successfully registered for event",
		});
	});
});

const cancelRegistration = asyncHandler(async (req, res) => {
	const eventId = req.params.id;
	const userId = req.params.userId;

	// 1. Check if event exists
	const event = await Event.findByPk(eventId);
	if (!event) {
		return res.status(404).send({
			success: false,
			message: "Event not found",
		});
	}

	// 2. Check if registration exists
	const registration = await Registration.findOne({
		where: { EventId: eventId, UserId: userId },
	});
	if (!registration) {
		return res.status(400).send({
			success: false,
			message: "User is not registered for this event",
		});
	}

	// 3. Delete the registration
	await registration.destroy();

	res.status(200).send({
		success: true,
		message: "Registration cancelled successfully",
	});
});

const eventStats = asyncHandler(async (req, res) => {
	const eventId = req.params.id;

	// 1. Find the event
	const event = await Event.findByPk(eventId);
	if (!event) {
		return res.status(404).send({
			success: false,
			message: "Event not found",
		});
	}

	// 2. Count registrations
	const registrationCount = await Registration.count({
		where: { EventId: eventId },
	});

	// 3. Compute remaining capacity and % used
	const remainingCapacity = event.capacity - registrationCount;
	const percentageUsed = (registrationCount / event.capacity) * 100;

	res.status(200).send({
		success: true,
		data: {
			totalRegistrations: registrationCount,
			remainingCapacity,
			percentageUsed: percentageUsed.toFixed(2) + "%",
		},
	});
});

const upcomingEvents = asyncHandler(async (req, res) => {
	const now = new Date();

	const events = await Event.findAll({
		where: {
			dateTime: {
				[require("sequelize").Op.gt]: now,
			},
		},
		order: [
			["dateTime", "ASC"],
			["location", "ASC"],
		],
	});

	res.status(200).send({
		success: true,
		data: events,
	});
});

module.exports = {
	createEvent,
	getEvent,
	eventStats,
	registerUser,
	cancelRegistration,
	upcomingEvents,
};
