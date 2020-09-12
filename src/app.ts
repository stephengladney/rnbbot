require("dotenv").config({ path: "../.env" })

import express from "express"
import bodyParser from "body-parser"
import { checkforStagnants } from "./lib/jira"
import sequelize from "./config/sequelize"

const app = express()
export const stagnantCards: [] = []

sequelize.sync()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require("./routes"))

let statusPoller = setInterval(() => {
  checkforStagnants(stagnantCards)
}, 60000)

app.listen(Number(process.env.PORT) || 5000, () => {
  console.log("RnBot server is now running!")
})
