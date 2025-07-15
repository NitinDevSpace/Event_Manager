const User = require('./User');
const Event = require('./Event');
const Registration = require('./Registration');

User.belongsToMany(Event, { through: Registration });
Event.belongsToMany(User, { through: Registration });