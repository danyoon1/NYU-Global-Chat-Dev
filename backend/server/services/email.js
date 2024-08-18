const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    services: 'gmail',
    host: 'smtp.gmail.com',
    secure: true, // ?
    auth: { // ?
        user: 'nyuglobalchat@gmail.com',
        pass: process.env.EMAIL_PWD
    }
});

const verifyUserEmail = async (user, email, token) => {
    try {
        let info = await transporter.sendMail({
            from: 'nyuglobalchat@gmail.com',
            to: email,
            subject: `Hello ${user}, please verify your email`,
            // html: `https://nyuglobalchat.com/verifyEmail/${user}/${token}`
            html: `http://localhost:3000/verifyEmail/${user}/${token}`
        })
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    verifyUserEmail
}