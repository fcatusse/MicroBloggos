const express = require("express");
const bodyParser = require("body-parser");

const user = require("./routes/user.route");
const message = require("./routes/message.route");
const hashtag = require("./routes/hashtag.route");
const app = express();

const mongoose = require("mongoose");

// Set up default mongoose connection
// let mongoDB = process.env.MONGODB_URI;
let mongoDB = 'mongodb://127.0.0.1:27017/MicroBloggos';

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB error: %s', err);
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("/*", function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.use("/user", user);
app.use("/message", message);
app.use("/hashtag", hashtag);

let port = 8080;
app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});

module.exports = app;
