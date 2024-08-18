const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

router.post('/', verificationController.handleVerification);

module.exports = router;