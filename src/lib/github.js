require("dotenv").config()
const fs = require("fs")
const path = require("path")
const Octokit = require("@octokit/rest")
const { createAppAuth } = require("@octokit/auth-app")

const APP_ID = process.env.GITHUB_APP_ID
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

const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    id: APP_ID,
    privateKey: PRIVATE_KEY
  }
})

function getPrNumberFromUrl(url) {
  let result = null
  for (i = url.length - 1; i >= 0; i--) {
    if (url[i] === "/") {
      result = url.substr(i + 1)
      break
    }
  }
  return result
}

function retrieveToken() {
  return appOctokit.auth({
    type: "installation",
    installationId: 5135879
  })
}

async function findPullRequests(jiraTicket) {
  try {
    const { token } = await retrieveToken()
    const octokit = new Octokit({ auth: token })

    results = await octokit.search.issuesAndPullRequests({
      q: `${jiraTicket} +in:title+type:pr+is:open+org:salesloft`
    })

    return results.data.items.map(item => item.html_url)
  } catch (err) {
    return [`Error: ${err}`]
  }
}

function listRepos() {
  return octokit.repos.list()
}

function extractLabelFromPullRequestUrl(pullRequestUrl) {
  const url = new URL(pullRequestUrl)
  const [_, repoName, prNumber] =
    url.pathname.match(/\/(\w+)\/pull\/(\d+)/) || []

  if (!repoName || !prNumber) return "Unknown"
  return `${repoName}#${prNumber}`
}

module.exports = {
  findPullRequests,
  getPrNumberFromUrl,
  listRepos,
  extractLabelFromPullRequestUrl
}
