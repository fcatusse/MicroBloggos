const Message = require("../models/message.model");

exports.message_create = function(req, res) {
  let message = new Message({
    user_id: req.body.user_id,
    content: req.body.content
  });

  message.save(function(err) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "Message Created successfully!", message });
  });
};

exports.messages_list = function(req, res) {

  Message.find({}, null, { collation:{locale:"fr"}, sort:{create_time:-1} }, function(err, messages) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(messages);
  });
};

exports.message_details = function(req, res) {
  Message.findById(req.params.id, function(err, message) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(message);
  });
};

exports.message_update = function(req, res) {
  let body = {
    content: req.body.content,
    update_time: new Date()
  };
  Message.findByIdAndUpdate(req.params.id, { $set: body },  function(
    err,
    result
  ) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "Message Udpated successfully!", result });
  });
};

exports.message_delete = function(req, res) {
  Message.findByIdAndRemove(req.params.id, function(err, result) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send({ message: "Message Deleted successfully!", result });
  });
};
