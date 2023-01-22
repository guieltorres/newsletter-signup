const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let email = req.body.email;
});

app.listen(port, function () {
  console.log("Server is running on port " + port);
});
