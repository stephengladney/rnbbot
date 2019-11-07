const express = require("express")
const app = express()
const { checkforStagnants, hours, processChange } = require("./jira")
const { findEngineerByEmail } = require("./team")
const bodyParser = require("body-parser")
const moment = require("moment")
const cards = []
const slack = require("./slack")

app.use(bodyParser.json())

let statusPoller = setInterval(() => {
  checkforStagnants(cards)
}, 60000)

app
  .post("/jirahook", (req, res) => {
    const cardNumber = req.body.issue.key
    const cardTitle = req.body.issue.fields.summary
    const assignee = findEngineerByEmail(
      req.body.issue.fields.assignee.emailAddress
    )
    const oldStatus = req.body.changelog.items[0].fromString
    const newStatus = req.body.changelog.items[0].toString
    const timeStamp = Date.now()

    cards.push({
      alertCount: 1,
      cardNumber: cardNumber,
      cardTitle: cardTitle,
      nextAlertTime: timeStamp + hours(2),
      lastColumnChangeTime: timeStamp,
      lastStatus: newStatus
    })

    processChange({
      assignee: assignee,
      cardNumber: cardNumber,
      cardTitle: cardTitle,
      newStatus: newStatus,
      oldStatus: oldStatus
    })
    res.status(200).send("OK")
  })
  .get("/amirunning", (req, res) => {
    res.send("Yes, I am running!")
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("RnBot server is now running!")
  })
