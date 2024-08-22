const User = require('../models/User');
const { verifyUserEmail } = require('../services/email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// node
// require('crypto').randomBytes(64).toString('hex')

const handleNewUser = async (req, res) => {

    const { user, pwd, email: stuEmail } = req.body;

    if (!user || !pwd || !stuEmail) {
        return res.status(400).json({ 'message': 'username, password, and email are required' });
    }

    // check for duplicate usernames and email in the db
    // const duplicateUser = await User.findOne({ username: user }).exec();
    // const duplicateEmail = await User.findOne({ email: stuEmail }).exec();
    const duplicateUser = await User.findOne({ username: user });
    const duplicateEmail = await User.findOne({ email: stuEmail });
    if (duplicateUser || duplicateEmail) {
        return res.sendStatus(409); // conflict
    }

    try {
        // encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // create and store new user
        const newUser = await User.create({
            username: user,
            password: hashedPwd,
            email: stuEmail
        })

        const emailToken = jwt.sign(
            {
                username: user
            },
            process.env.EMAIL_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        verifyUserEmail(user, stuEmail, emailToken);

        res.status(201).json({ 'success': `new user ${user} created` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser }