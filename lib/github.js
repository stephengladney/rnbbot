require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { App } = require("@octokit/app")
const { request } = require("@octokit/request")
const { createAppAuth } = require("@octokit/auth-app")
const axios = require("axios")

const APP_ID = process.env.GITHUB_APP_ID

const CLIENT_ID = process.env.GITHUB_CLIENT_ID
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const EMAIL = process.env.GITHUB_EMAIL
let PRIVATE_KEY
try {
  PRIVATE_KEY = fs.readFileSync(
    path.resolve(__dirname, "../rnbot-private-key.pem"),
    {
      encoding: "utf-8"
    }
  )
} catch (err) {
  PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY
}

const gitHub = new App({ id: APP_ID, privateKey: PRIVATE_KEY })

module.exports = {
  getCode,
  getToken,
  gitHub
}
