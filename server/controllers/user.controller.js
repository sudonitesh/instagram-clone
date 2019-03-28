const mongoose = require('mongoose')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

const UserModel = require('../models').User;


const user_signup = (req, res, next) => {
  UserModel.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(422).json({
          message: 'email already exist'
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            const user = new UserModel({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              name: req.body.name,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result)
                res.status(201).json({
                  message: 'User created',
                  CreatedUser: result
                })
              })
              .catch(err => {
                console.log(err)
                res.status(500).json({
                  error: err
                })
              })
          }
        });
      }
    })
}

const user_login = (req, res, next) => {
  UserModel.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Auth failed'
            })
          }
          if (result) {
            const token = jwt.sign({
                email: user[0].email,
                userId: user[0]._id
              },
              "secret", // use process.env.VARIABLE
              {
                expiresIn: "1111h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            })
          }
          res.status(401).json({
            message: 'Auth failed'
          })
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

const user_remove = (req, res, next) => {
  // console.log(req.userData.userId)
  UserModel.remove({
      _id: req.userData.userId
    })
    .exec()
    .then(user => {
      return res.json({
        status: 'success',
        deletedUser: user,
        message: 'user deleted'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

const user_update = (req, res, next) => {
  const id = req.userData.userId
  UserModel
    .findById(id)
    .exec()
    .then(user => {
      req.profile = user
      // console.log(req.profile)
      let form = new formidable.IncomingForm()
      form.keepExtensions = true
      form.parse(req, (err, fields, files) => {
        if(err) {
          res.status(500).json({
            error: err
          })
        }
        user = _.extend(user, fields)
        user.updatedDate = Date.now()
        if(files.photo){
          user.photo.data = fs.readFileSync(files.photo.path)
          user.photo.contentType = files.photo.type
        }
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            })
          }
          res.json(user)
        })
      })

    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

const photo = (req, res, next) => {
  const id = req.userData.userId
  UserModel
    .findById(id)
    .exec()
    .then(user => {
      if(user.photo.data) {
        res.set("Content-Type", user.photo.contentType)
        return res.send(user.photo.data)
      }
      next()
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+profileImage)
}

const user_findById = (req, res, next) => {
  UserModel
    .find({
      _id: req.params.id
    })
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec()
    .then(user => {
      user[0].password = undefined
      console.log(user)
      res.json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

const addFollowing = (req, res, next) => {
  UserModel
    .findByIdAndUpdate(req.userData.userId, {
      $push: {
        following: req.body.followId
      }
    }, (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      console.log(result)
      next()
    })
}

const addFollower = (req, res, next) => {
  UserModel
    .findByIdAndUpdate(req.body.followId, {
      $push: {
        followers: req.userData.userId
      }
    }, {
      new: true
    })
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec()
    .then(result => {
      result.password = undefined
      res.json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })

}

const removeFollowing = (req, res, next) => {
  UserModel
    .findByIdAndUpdate(req.userData.userId, {
      $pull: {
        following: req.body.unfollowId
      }
    }, (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      next()
    })
}
const removeFollower = (req, res) => {
  UserModel
    .findByIdAndUpdate(req.body.unfollowId, {
      $pull: {
        followers: req.userData.userId
      }
    }, {
      new: true
    })
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      result.password = undefined
      res.json(result)
    })
}

const findPeople = (req, res) => {
  const id = req.userData.userId
  UserModel
    .findById(id)
    .exec()
    .then(user => {
      let following = user.following
      following.push(user._id)

      UserModel
        .find({ _id: { $nin : following } }, (err, users) => {
          if (err) {
            return res.status(400).json({
              error: err
            })
          }
          res.json(users)
        }).select('name')

    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}


module.exports = {
  user_signup,
  user_login,
  user_remove,
  user_findById,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
  // not tested below
  user_update,
  photo,
  defaultPhoto
}