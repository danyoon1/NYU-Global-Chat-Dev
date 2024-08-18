const User = require('../models/User');

const getAllUsers = async (req, res) => {
    const users = await User.find({}, 'username').exec();
    if (!users) {
        return res.status(204).json({ 'message': 'no users found' });
    }
    res.json(users);
}

module.exports = { getAllUsers }