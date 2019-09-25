const express = require("express");
const app = express();
const slack = require("./slack");
const team = require("./team");

app
  .get("/qa", () => {
    slack.notify.readyForQA(
      "emailnotifications",
      "SL-13561",
      "New One Off --- insert template with attachments not showing name of attachment",
      "gladney"
    );
  })
  .get("/r4r", () => {
    slack.notify.readyForReview(
      "emailnotifications",
      "SL-13561",
      "Implement attachments for Workflow email pane"
    );
  })
  .get("/r4m", () => {
    slack.notify.readyForMerge(
      "emailnotifications",
      "SL-13561",
      "Implement attachments for Workflow email pane",
      "gladney"
    );
  })
  .get("/jirahook", () => {
    
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("rnbBot server is now running!");
  });
