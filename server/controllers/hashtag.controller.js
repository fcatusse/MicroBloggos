const Hashtag = require("../models/hashtag.model");

exports.hashtag_create = function(name, id) {
  let hashtag = new Hashtag({
    name: name,
    messages_id: [id]
  });
  hashtag.save();
};

exports.hashtags_list = function(req, res) {
  Hashtag.find({ messages_id: { $ne: [] } }, function(err, hashtags) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(hashtags);
  });
};

/*exports.hashtag_details = function(req, res) {
  Hashtag.findById(req.params.id, function(err, hashtag) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(hashtag);
  });
};*/

exports.hashtag_update = function(hashtag_id, message_id, action) {
  if (action === 'push') {
    Hashtag.findByIdAndUpdate(hashtag_id, { $push: {messages_id: message_id } }, function(err) {
      if (err) {
        return err;
      }
    });
  } else {
    Hashtag.findByIdAndUpdate(hashtag_id, { $pull: {messages_id: message_id } }, function(err) {
      if (err) {
        return err;
      }
    });
  }
};

/*exports.hashtag_delete = function(req, res) {
  Hashtag.findByIdAndRemove(req.params.id, function(err, result) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "Hashtag Deleted successfully!", result });
  });
};*/
