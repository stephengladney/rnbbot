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
        "New One Off --- insert template with attachments not showing name of attachment"
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
      engineer: "stephen.gladney@salesloft.com"
    })
    res.status(200).send("OK")
  })
  .post("/jirahook", (req, res) => {
    console.log("~~~ Hook endpoint hit! ~~~")
    console.log(req.body)
    res.status(200).send("OK")
  })
  .get("/amirunning", (req, res) => {
    res.send("Yes, I am running!")
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("rnbBot server is now running!")
  })
