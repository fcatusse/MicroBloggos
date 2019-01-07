const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  user_id: { type: Number, required: true },
  content: { type: String, required: true },
  create_time: { type: Date, default: Date.now},
  uptdate_time: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Message", MessageSchema);
