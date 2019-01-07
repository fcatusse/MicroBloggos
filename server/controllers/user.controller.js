const User = require("../models/user.model");

exports.user_create = function(req, res) {
  let user = new User({
    name: req.body.name,
    quantity: req.body.quantity,
    unitType: req.body.unitType
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
