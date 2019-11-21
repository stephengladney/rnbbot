const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { findTeamMemberByEmail } = require("./team")
const { seeIfWorks } = require("./lib/github")
const { processWebhook } = require("./lib/jira")
const { processSlashCommand } = require("./lib/slack")
const stagnantCards = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let statusPoller = setInterval(() => {
  checkforStagnants(stagnantCards)
}, 60000)

app
  .post("/jirahook", (req, res) => {
    processWebhook({
      body: req.body,
      stagnantCards: stagnantCards
    })

    res.status(200).send("OK")
  })

  .post("/slash/", (req, res) => {
    const text = req.body.text
    processSlashCommand({
      text: text,
      stagnantCards: stagnantCards
    })
    res.status(200).send()
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
