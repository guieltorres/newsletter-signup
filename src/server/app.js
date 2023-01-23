require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("node:https");
const client = require("@mailchimp/mailchimp_marketing");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// remember to add you api configuration bellow to run locally

const apiKey = process.env.API_KEY;
const server = process.env.MAILCHIMP_SERVER;
const listId = process.env.LIST_ID;

client.setConfig({
  apiKey: apiKey,
  server: server,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "..", "src", "views", "signup.html"));
});

app.post("/", function (req, res) {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  // https request version

  const url = `https://${server}.api.mailchimp.com/3.0/lists/${listId}`;

  const options = {
    method: "POST",
    auth: "username:" + apiKey,
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
    if (response.statusCode === 200) {
      res.sendFile(
        path.join(__dirname, "..", "..", "src", "views", "success.html")
      );
    } else {
      res.sendFile(
        path.join(__dirname, "..", "..", "src", "views", "failure.html")
      );
    }
  });

  app.post("/failure", function (req, res) {
    res.redirect("/");
  });

  request.write(jsonData); // comment this line to see the error page
  request.end();

  // mailchimp client version

  // const run = async () => {
  //   const response = await client.lists.batchListMembers(listId, jsonData);
  //   console.log(response);
  // };

  // run();
});

app.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
