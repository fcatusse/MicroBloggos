const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  subscriptions_id: { type: Array, required: false }
});

module.exports = mongoose.model("User", UserSchema);
