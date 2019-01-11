const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let HashtagSchema = new Schema({
  name: { type: String, required: true },
  messages_id: { type: Array, required: true },
  create_time: { type: Date, default: Date.now},
  update_time: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Hashtag", HashtagSchema);
