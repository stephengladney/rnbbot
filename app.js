const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { hours } = require("./numbers")
const { findTeamMemberByEmail } = require("./team")
const { checkforStagnants } = require("./jira")
const { notify } = require("./slack")
const { statusSettings } = require("./settings")
const cards = []

app.use(bodyParser.json())

let statusPoller = setInterval(() => {
  checkforStagnants(cards)
}, 60000)

app
  .post("/jirahook", (req, res) => {
    const cardData = {
      cardNumber: req.body.issue.key,
      cardTitle: req.body.issue.fields.summary,
      previousStatus: req.body.changelog.items[0].fromString,
      currentStatus: req.body.changelog.items[0].toString,
      assignee: findTeamMemberByEmail(
        req.body.issue.fields.assignee.emailAddress
      )
    }

    const cardIndex = cards.findIndex(
      card => card.cardNumber === cardData.cardNumber
    )
    if (cardIndex !== -1) cards.splice(cardIndex, 1)

    if (!!statusSettings[currentStatus].notifyOnEntry)
      notify[currentStatus](cardData)

    if (!!statusSettings[currentStatus].monitorForStagnant) {
      const timeStamp = Date.now()
      cards.push({
        ...cardData,
        alertCount: 1,
        nextAlertTime: timeStamp + hours(2),
        lastColumnChangeTime: timeStamp
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
