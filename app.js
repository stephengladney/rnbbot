const express = require("express");
const app = express();
const slack = require("./slack");
const team = require("./team");

app
  .get("/qa", (req, res) => {
    slack.notify.readyForQA(
      "emailnotifications",
      "SL-13561",
      "New One Off --- insert template with attachments not showing name of attachment",
      "gladney"
    );
    res.status(200).send("OK");
  })
  .get("/r4r", (req, res) => {
    slack.notify.readyForReview(
      "emailnotifications",
      "SL-13561",
      "Implement attachments for Workflow email pane"
    );
    res.status(200).send("OK");
  })
  .get("/r4m", (req, res) => {
    slack.notify.readyForMerge(
      "emailnotifications",
      "SL-13561",
      "Implement attachments for Workflow email pane",
      "gladney"
    );
    res.status(200).send("OK");
  })
  .get("/jirahook", (req, res) => {
    res.status(200).send("OK");
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("rnbBot server is now running!");
  });
