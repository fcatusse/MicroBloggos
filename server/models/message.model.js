const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  content: { type: String, required: true },
  user_id: { type: Object, required: true },
  create_time: { type: Date, default: Date.now},
  update_time: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Message", MessageSchema);
