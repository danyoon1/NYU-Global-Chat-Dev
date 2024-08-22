const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// jobs
// 1. assign new access token if refresh token valid
// 2. rotate new refresh token
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;
    // clear cookie to create new one
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 1000 * 60 * 60 * 24 })

    // const foundUser = await User.findOne({ refreshToken }).exec();
    const foundUser = await User.findOne({ refreshToken });

    // refresh token reuse detected
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) { // expired token
                    return res.sendStatus(403); // forbidden
                }
                // let hackedUser = await User.findOne({ username: decoded.username }).exec();
                let hackedUser = await User.findOne({ username: decoded.username });
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
            }
        );
        return res.sendStatus(403); // forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) { // expired token
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }

            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403); // forbidden
            }

            // refresh token still valid
            const userRoles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: decoded.username,
                        roles: userRoles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            // issue new refresh token to array
            const newRefreshToken = jwt.sign(
                { username: decoded.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            // get verification status
            const verification = foundUser.verified;

            // send new refresh token as cookie
            // res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            // use secure for production, does not work with thunder client
            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

            res.json({ accessToken, verification });
        }
    );
}

module.exports = { handleRefreshToken }