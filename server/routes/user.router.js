const express = require('express')
const mongoose = require('mongoose')

const checkAuth = require('../middlewares/check-auth');
const userController = require('../controllers/user.controller')

const router = express.Router();

router.post('/login', userController.user_login)
router.post('/signup', userController.user_signup)

router.get('/findUser/:id', checkAuth, userController.user_findById)
router.delete('/del_account', checkAuth, userController.user_remove)
// add following in my list && add follower in the person's list
router.put('/follow', checkAuth, userController.addFollowing, userController.addFollower)
router.put('/unfollow', checkAuth, userController.removeFollowing, userController.removeFollower)
router.get('/update', checkAuth, userController.user_update)
router.get('/findPeople', checkAuth, userController.findPeople)
module.exports = router;

// const appendUserToREQ = (req, res, next) => {
//   UserModel
//     .findById(req.userData.userId)
//     .populate('following', '_id name')
//     .populate('followers', '_id name')
//     .exec()
//     .then(user => {
//       req.profile = user
//       next()
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(500).json({
//         error: err
//       })
//     })
// }