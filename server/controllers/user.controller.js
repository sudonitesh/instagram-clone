const mongoose = require('mongoose')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


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
  UserModel.remove({
      _id: req.params.id
    })
    .exec()
    .then(res => {
      res.status(200).json({
        messgae: 'user present, need to be deleted'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

const user_findById = (req, res, next) => {
  UserModel
    .find({_id: req.params.id})
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec()
    .then(user => {
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

module.exports = {
  user_signup,
  user_login,
  user_remove,
  user_findById
}