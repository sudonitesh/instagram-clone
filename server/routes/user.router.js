const express = require('express')
const mongoose = require('mongoose')

const checkAuth = require('../middlewares/check-auth');
const userController = require('../controllers/user.controller')

const router = express.Router();

router.post('/login', userController.user_login)
router.post('/signup', userController.user_signup)
router.get('/:id',checkAuth, userController.user_findById)

module.exports = router;
