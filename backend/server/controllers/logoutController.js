const User = require('../models/User');

const handleLogout = async (req, res) => {
    // on client delete access token from memory

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // no content
    }

    const refreshToken = cookies.jwt;

    // check if refresh token in db
    const foundUser = await User.findOne({refreshToken}).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
    }

    // delete refresh token from db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save();

    // clear cookies
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
    res.sendStatus(204); // no content

}

module.exports = {handleLogout}