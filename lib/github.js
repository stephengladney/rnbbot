require("dotenv").config()
const { App } = require("@octokit/app")
const { request } = require("@octokit/request")
const { createAppAuth } = require("@octokit/auth-app")
const axios = require("axios")

const APP_ID = process.env.GITHUB_APP_ID
// const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\n${new Buffer(
//   process.env.GITHUB_PRIVATE_KEY
// ).toString("base64")}\n-----END PRIVATE KEY-----`

// const PRIVATE_KEY = ""
const CLIENT_ID = process.env.GITHUB_CLIENT_ID
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const EMAIL = process.env.GITHUB_EMAIL

// const gitHub = new App({ id: APP_ID, privateKey: PRIVATE_KEY })
// const jwt = gitHub.getSignedJsonWebToken()

async function seeIfWorks() {}

function getCode() {
  return axios.post(
    `https://github.com/login/oauth/authorize?scope=user:${EMAIL}&client_id=${CLIENT_ID}`
  )
}

// function getToken(code) {
//   return axios.post("https://github.com/login/oauth/access_token", {
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//     code: code,
//     accept: "application/json"
//   })
// }

const auth = createAppAuth({
  id: APP_ID,
  privateKey: PRIVATE_KEY,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET
})

function getToken() {
  return auth({ type: "app" })
}

module.exports = {
  getCode,
  getToken,
  seeIfWorks
}
