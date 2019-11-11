require("dotenv").config()
const { App } = require("@octokit/app")
const { request } = require("@octokit/request")
const { createAppAuth } = require("@octokit/auth-app")

const APP_ID = process.env.GITHUB_APP_ID
const PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY
const CLIENT_ID = process.env.GITHUB_CLIENT_ID
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

// const gitHub = new App({ id: APP_ID, privateKey: PRIVATE_KEY })
// const jwt = gitHub.getSignedJsonWebToken()

async function seeIfWorks() {
  //   const { data } = await request("GET /app/installations/", {
  //     headers: {
  //       authorization: `Bearer ${jwt}`,
  //       accept: "application/vnd.github.machine-man-preview+json"
  //     }
  //   })

  //   // contains the installation id necessary to authenticate as an installation
  //   console.log(JSON.stringify(data))
  // }

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  })

  const appAuthentication = await auth({ type: "auth" })
  console.log(appAuthentication)
}

module.exports = {
  seeIfWorks: seeIfWorks
}
