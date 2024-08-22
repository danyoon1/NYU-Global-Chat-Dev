const User = require('../models/User');

const getAllUsers = async (req, res) => {
    // const users = await User.find({}, 'username').exec();
    const users = await User.find({}, 'username');
    if (!users) {
        return res.status(204).json({ 'message': 'no users found' });
    }
    res.json(users);
}

const setProfile = async (req, res) => {
    const { user, school, year, bio } = req.body;

    // const foundUser = await User.findOne({ username: user }).exec();
    const foundUser = await User.findOne({ username: user });

    if (!foundUser) {
        return res.sendStatus(401);
    }

    foundUser.profile.school = school;
    foundUser.profile.year = year;
    foundUser.profile.biography = bio;

    const result = await foundUser.save();

    res.json({ 'success': 'profile successfully set' });
}

const getProfile = async (req, res) => {
    const user = req.params.user;

    // const foundUser = await User.findOne({ username: user }).exec();
    const foundUser = await User.findOne({ username: user });

    if (!foundUser) {
        return res.sendStatus(401);
    }

    res.json({ school: foundUser.profile.school, year: foundUser.profile.year, bio: foundUser.profile.biography });
}

module.exports = { getAllUsers, setProfile, getProfile }