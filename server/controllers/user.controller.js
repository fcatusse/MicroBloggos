const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const env_key = require("../env.json")

exports.user_create = function(req, res) {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    subscriptions_id: req.body.subscriptions_id
  });

  user.save(function(err) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "User Created successfully!", user });
  });
};

exports.users_list = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(users);
  });
};

exports.user_details = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(user);
  });
};

exports.user_find_email = function(req, res) {
  User.findOne({ email: req.params.email }, function(err, user) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(user);
  });
};

exports.user_update = function(req, res) {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, function(
    err,
    user
  ) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "User Udpated successfully!", user });
  });
};

exports.user_delete = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, result) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "User Deleted successfully!", result });
  });
};

exports.user_signup = function(req, res) {
  User.findOne({ email: req.body.email })
    .then(result => {
      if (result != null) {
        return res.status(409).json({
          message: "Mail exists"
        });
      }
      User.findOne({ username: req.body.username })
      .then(result => {
        if (result != null) {
          return res.status(409).json({
            message: "Username exists"
          });
        }
        let salt = bcrypt.genSaltSync(128);
        var hash = bcrypt.hashSync(req.body.password, salt);
        let user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash
        });
        
        user.save(function(err) {
          if (err) {
            res.status(400);
            res.send(err);
            return;
          }
          res.send({ message: "User Created successfully!", user });
        });
      });
      
    });
};

exports.user_login = function(req, res) {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user === null) {
        return res.status(404).json({
          message: "User doesn't exist, mail not found"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign({
            id: user._id,
            email: user.email
          }, env_key.env.JWT_KEY, 
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        return res.status(404).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.user_verifytoken = function(req, res) {
  let token = req.body.token;
  console.log(token);
  jwt.verify(token, env_key.env.JWT_KEY, function(err, decoded) {
    if (err) {
      console.log(err);
      return res.status(200).json({
        id: null
      });
    }
    return res.status(200).json({
      id: decoded.id
    });
  });
  
};
