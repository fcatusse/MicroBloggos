const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let HashtagSchema = new Schema({
  name: { type: Number, required: true },
  messages_id: { type: Array, required: true }
});

module.exports = mongoose.model("Hashtag", HashtagSchema);
