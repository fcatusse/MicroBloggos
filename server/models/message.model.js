const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  user_id: { type: Number, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model("Message", MessageSchema);
