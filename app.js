const express = require("express")
const app = express()
const slack = require("./slack")
const team = require("./team")
const bodyParser = require("body-parser")

app.use(bodyParser.json())

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
    const ticket = req.body.issue.key
    const engineer = team.findEngineerByEmail(
      req.body.issue.fields.assignee.emailAddress
    ).firstName
    const oldStatus = req.body.changelog.items[0].fromString
    const newStatus = req.body.changelog.items[0].toString
    console.log(`${engineer} moved ${ticket} from ${oldStatus} to ${newStatus}`)
    res.status(200).send("OK")
  })
  .get("/amirunning", (req, res) => {
    res.send("Yes, I am running!")
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("rnbBot server is now running!")
  })
