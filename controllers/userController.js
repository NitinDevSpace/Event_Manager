const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const Registration = require('../models/Registration');
const { Op } = require("sequelize");

const getEvents = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).send({
            success: false,
            message: "User not found",
        });
    }
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const registerations = await Registration.findAll({
        where: {
            UserId: user.id,
            createdAt: {
                [Op.gte]: oneMonthAgo
            }
        }
    });
    if (registerations.length === 0) {
        return res.status(404).send({
            success: true,
            message: "No registrations found for this user",
        });
    }

    res.status(200).send({
        success: true,
        message: "Registratios found",
        data: registerations,
    });
    
});

module.exports = getEvents;