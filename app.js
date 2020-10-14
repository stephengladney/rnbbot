const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { checkforStagnants, processWebhook } = require("./lib/jira")
const { findPullRequests, giveMeToken, listRepos } = require("./lib/github")
const { processSlashCommand } = require("./lib/slash")
const stagnantCards = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let statusPoller = setInterval(() => {
  checkforStagnants(stagnantCards)
}, 60000)

app
  .post("/jirahook", (req, res) => {
    console.log(`10500: ${req.body.issue.customfield_10500}`)
    console.log(`10900: ${req.body.issue.customfield_10900}`)
    console.log(`10025: ${req.body.issue.customfield_10025}`)
    console.log(`11830: ${req.body.issue.customfield_11830}`)
    
    processWebhook({
      body: req.body,
      stagnantCards: stagnantCards
    })

    res.status(200).send("OK")
  })

  .post("/slash/", (req, res) => {
    const user = req.body.user_id
    const text = req.body.text
    processSlashCommand({
      stagnantCards: stagnantCards,
      text: text,
      user: user
    })
    res.status(200).send()
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("RnBot server is now running!")
  })
