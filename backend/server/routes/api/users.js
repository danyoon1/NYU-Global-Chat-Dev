const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

router.get('/', verifyRoles(ROLES_LIST.Admin), userController.getAllUsers);
router.post('/setProfile', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), userController.setProfile);
router.get('/getProfile/:user', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), userController.getProfile);

module.exports = router;