const express = require("express");
const app = express();
const slack = require("./slack");
const team = require("./team");

app
  .get("/helloworld", () => {
    console.log("HELLO WORLD endpoint hit!");
  })

  .get("/qa", () => {
    slack.notify.readyForQA(
      "emailnotifications",
      "SL-3424",
      team.findEngineerByEmail("stephen.gladney@salesloft.com").slackHandle
    );
  })
  .get("/r4r", () => {
    slack.notify.readyForReview("emailnotifications", "SL-3424");
  })
  .get("/r4m", () => {
    slack.notify.readyForMerge("emailnotifications", "SL-3424", "gladney");
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("rnbBot server is now running!");
  });
