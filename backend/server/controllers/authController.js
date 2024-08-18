const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;

    // check body for valid user/pwd
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required' });
    }
    // check and set foundUser
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) {
        return res.sendStatus(401); // unauthorized
    }

    // if password matches
    const userRoles = Object.values(foundUser.roles).filter(Boolean);
    if (await bcrypt.compare(pwd, foundUser.password)) {
        // create JWTs
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: user,
                    roles: userRoles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const newRefreshToken = jwt.sign(
            { username: user },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // token rotation
        // check if token exists in cookies, create array without cookie token
        let newRefreshTokenArray = [];
        if (cookies?.jwt) {
            newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== cookies.jwt);
        } else {
            newRefreshTokenArray = foundUser.refreshToken;
        }

        // if token exists in cookies, clear token from cookies
        if (cookies?.jwt) {

            /*
            Potential reuse scenario:
            1) user logs in but never uses RT and does not logout
            2) RT is stolen
            3) hacker uses RT and RT is rotated in the process
            4) user tries logging back in but RT does not exist in DB since it was rotated by hacker (expired or not)
            */

            // potential token reuse
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // token reuse detected
            if (!foundToken) {
                newRefreshTokenArray = [];
            }

            // clear cookies
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        }

        // save new rt list to db
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        // get verification status
        const verification = foundUser.verified;

        // store refresh token as cookie (http only)
        // res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        // use secure for production, does not work with thunder client
        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })

        // store in memory on frontend
        res.json({ accessToken, verification });
    } else {
        res.sendStatus(401) // unauthorized
    }
}

module.exports = { handleLogin };