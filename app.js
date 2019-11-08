const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { findTeamMemberByEmail } = require("./team")
const {
  addToStagnants,
  checkforStagnants,
  removeFromStagnants
} = require("./lib/jira")
const { notifyOfEntry } = require("./lib/slack")
const stagnantCards = []

app.use(bodyParser.json())

let statusPoller = setInterval(() => {
  checkforStagnants(stagnantCards)
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

    removeFromStagnants({
      cardData: cardData,
      stagnantCards: stagnantCards
    })

    notifyOfEntry(cardData)

    addToStagnants({
      cardData: cardData,
      stagnantCards: stagnantCards
    })

    res.status(200).send("OK")
  })
  .get("/amirunning", (req, res) => {
    res.send("Yes, I am running!")
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("RnBot server is now running!")
  })
