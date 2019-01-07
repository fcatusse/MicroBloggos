const Hashtag = require("../models/hashtag.model");

exports.hashtag_create = function(req, res) {
  let hashtag = new Hashtag({
    name: req.body.name,
    ƒ: req.body.messages_id
  });

  hashtag.save(function(err) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "Hashtag Created successfully!", hashtag });
  });
};

exports.hashtags_list = function(req, res) {
  Hashtag.find({}, function(err, hashtags) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(hashtags);
  });
};

exports.hashtag_details = function(req, res) {
  Hashtag.findById(req.params.id, function(err, hashtag) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(hashtag);
  });
};

exports.hashtag_update = function(req, res) {
  Hashtag.findByIdAndUpdate(req.params.id, { $set: req.body }, function(
    err,
    hashtag
  ) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "Hashtag Udpated successfully!", hashtag });
  });
};

exports.hashtag_delete = function(req, res) {
  Hashtag.findByIdAndRemove(req.params.id, function(err, result) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "Hashtag Deleted successfully!", result });
  });
};
