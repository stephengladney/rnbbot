require("dotenv").config()
const { App } = require("@octokit/app")
const { request } = require("@octokit/request")

const APP_ID = process.env.GITHUB_APP_ID
const PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY

const gitHub = new App({ id: APP_ID, privateKey: PRIVATE_KEY })
const jwt = gitHub.getSignedJsonWebToken()

const { data } = await request("GET /repos/:owner/:repo/installation", {
  owner: "hiimbex",
  repo: "testing-things",
  headers: {
    authorization: `Bearer ${jwt}`,
    accept: "application/vnd.github.machine-man-preview+json"
  }
})

// contains the installation id necessary to authenticate as an installation
const installationId = data.id
