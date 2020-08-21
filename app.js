require("dotenv").config()
const express = require("express")
const app = express()
const db = require("./lib/db")
const bodyParser = require("body-parser")
const { checkforStagnants, processWebhook } = require("./lib/jira")
const { processSlashCommand } = require("./lib/slash")
const stagnantCards = []

console.log(process.env.DATABASE_URL)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let statusPoller = setInterval(() => {
  checkforStagnants(stagnantCards)
}, 60000)

app
  .post("/jirahook", (req, res) => {
    processWebhook({
      body: req.body,
      stagnantCards: stagnantCards,
    })

    res.status(200).send("OK")
  })

  .post("/slash/", (req, res) => {
    const user = req.body.user_id
    const text = req.body.text
    processSlashCommand({
      stagnantCards: stagnantCards,
      text: text,
      user: user,
    })
    res.status(200).send()
  })

  .get("/dbtest", (req, res) => {
    db.createPerson({
      firstName: "Stephen",
      lastName: "Gladney",
      emailAddress: "stephen.gladney@salesloft.com",
      slackHandle: "gladney",
      slackId: "U0JFDH6DT",
    })
      .then((result) => {
        res.status(200).send(result)
      })
      .catch((err) => res.send(err))
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("RnBot server is now running!")
  })
