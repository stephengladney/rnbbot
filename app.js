const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { checkforStagnants, processWebhook } = require("./lib/jira")
const { findPullRequest, giveMeToken, listRepos } = require("./lib/github")
const { processSlashCommand } = require("./lib/slash")
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
    const user = req.body.user_id
    const text = req.body.text
    processSlashCommand({
      stagnantCards: stagnantCards,
      text: text,
      user: user
    })
    res.status(200).send()
  })

  .get("/findpr", async (req, res) => {
    try {
      const result = await findPullRequest(req.query.ticket)
      console.log(result[0])
    } catch {
      console.log("error")
    }
  })

  .get("/repos", (req, res) => {
    console.log(listRepos())
  })

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("RnBot server is now running!")
  })
