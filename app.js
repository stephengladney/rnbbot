const express = require("express")
const app = express()
const slack = require("./slack")
const team = require("./team")

app
  .get("/qa", (req, res) => {
    slack.notify.readyForQA({
      channel: "emailnotifications",
      jiraCard: "SL-13561",
      cardTitle:
        "New One Off --- insert template with attachments not showing name of attachment",
      qaEngineerSlackHandle: "gladney"
    })
    res.status(200).send("OK")
  })
  .get("/r4r", (req, res) => {
    slack.notify.readyForReview({
      channel: "emailnotifications",
      jiraCard: "SL-13561",
      cardTitle: "Implement attachments for Workflow email pane"
    })
    res.status(200).send("OK")
  })
  .get("/r4m", (req, res) => {
    slack.notify.readyForMerge({
      channel: "emailnotifications",
      jiraCard: "SL-13561",
      cardTitle: "Implement attachments for Workflow email pane",
      engineerSlackHandle: "gladney"
    })
    res.status(200).send("OK")
  })
  .get("/jirahook", (req, res) => {
    console.log(req)
    res.status(200).send("OK")
  })
  .get("amirunning", (req, res) => {
    res.send("Yes, I am running!")
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("rnbBot server is now running!")
  })
