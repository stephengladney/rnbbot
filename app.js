const express = require("express")
const app = express()
const { processChange } = require("./jira")
const team = require("./team")
const bodyParser = require("body-parser")

app.use(bodyParser.json())

app
  .post("/jirahook", (req, res) => {
    const cardNumber = String(req.body.issue.key).substr(3)
    const cardTitle = req.body.issue.fields.summary
    const assignee = team.findEngineerByEmail(
      req.body.issue.fields.assignee.emailAddress
    )
    const oldStatus = req.body.changelog.items[0].fromString
    const newStatus = req.body.changelog.items[0].toString
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
    console.log("rnbBot server is now running!")
  })
