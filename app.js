const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { hours } = require("./numbers")
const { findTeamMemberByEmail } = require("./team")
const {
  checkforStagnants,
  isStatusICareAboutMonitoring,
  processChange
} = require("./jira")
const cards = []

app.use(bodyParser.json())

let statusPoller = setInterval(() => {
  checkforStagnants(cards)
}, 60000)

app
  .post("/jirahook", (req, res) => {
    const cardNumber = req.body.issue.key
    const cardTitle = req.body.issue.fields.summary
    const assignee = findTeamMemberByEmail(
      req.body.issue.fields.assignee.emailAddress
    )
    const oldStatus = req.body.changelog.items[0].fromString
    const newStatus = req.body.changelog.items[0].toString
    const timeStamp = Date.now()

    const cardIndex = cards.findIndex(card => card.cardNumber === cardNumber)
    if (cardIndex !== -1) cards.splice(cardIndex, 1)

    processChange({
      assignee: assignee,
      cardNumber: cardNumber,
      cardTitle: cardTitle,
      newStatus: newStatus,
      oldStatus: oldStatus
    })

    if (isStatusICareAboutMonitoring(newStatus)) {
      cards.push({
        alertCount: 1,
        cardNumber: cardNumber,
        cardTitle: cardTitle,
        nextAlertTime: timeStamp + hours(2),
        lastColumnChangeTime: timeStamp,
        status: newStatus
      })
    }
    res.status(200).send("OK")
  })
  .get("/amirunning", (req, res) => {
    res.send("Yes, I am running!")
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("RnBot server is now running!")
  })
