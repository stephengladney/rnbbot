const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { findTeamMemberByEmail } = require("./team")
const { seeIfWorks } = require("./lib/github")
const {
  addToStagnants,
  checkforStagnants,
  removeFromStagnants,
  getJiraCard,
  getGhToken,
  getPR
} = require("./lib/jira")
const { notifyOfEntry, sendMessage } = require("./lib/slack")
const stagnantCards = []

app.use(bodyParser.json())

let statusPoller = setInterval(() => {
  checkforStagnants(stagnantCards)
}, 60000)

app
  .post("/jirahook", (req, res) => {
    const fieldThatChanged = req.body.changelog.items[0].fieldId
    if (fieldThatChanged !== "status") return
    const cardData = {
      cardNumber: req.body.issue.key,
      cardTitle: req.body.issue.fields.summary,
      previousStatus: req.body.changelog.items[0].fromString,
      currentStatus: req.body.changelog.items[0].toString,
      assignee: req.body.issue.fields.assignee
        ? findTeamMemberByEmail(req.body.issue.fields.assignee.emailAddress)
        : "N/A"
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
  .post("/slash/", (req, res) => {
    bodyParser.urlencoded({ extended: true })
    console.log(req.body)
    res.status(200)
  })

  // .get("/tester", (req, res) => {
  //   getGhToken()
  //     .then(resp => {
  //       console.log(resp)
  //     })
  //     .catch(error => console.log(error))
  //   res.status(200).send("OK")
  // })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("RnBot server is now running!")
  })
