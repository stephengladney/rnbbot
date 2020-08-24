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
      encoding: "utf-8",
    }
  )
} catch (err) {
  PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY
}

const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    id: APP_ID,
    privateKey: PRIVATE_KEY,
  },
})

export function getPrNumberFromUrl(url: string) {
  return String(url).substr(url.lastIndexOf("/") + 1)
}

function retrieveToken() {
  return appOctokit.auth({
    type: "installation",
    installationId: 5135879,
  })
}

export async function findPullRequests(jiraTicket: string) {
  try {
    const { token } = await retrieveToken()
    const octokit = new Octokit({ auth: token })

    const results = await octokit.search.issuesAndPullRequests({
      q: `${jiraTicket} +in:title+type:pr+is:open+org:salesloft`,
    })

    return results.data.items.map((item: { html_url: string }) => item.html_url)
  } catch (err) {
    return [`Error: ${err}`]
  }
}

export function extractLabelFromPullRequestUrl(pullRequestUrl: string) {
  const url = new URL(pullRequestUrl)
  const [_, repoName, prNumber] =
    url.pathname.match(/\/(\w+)\/pull\/(\d+)/) || []

  if (!repoName || !prNumber) return "Unknown"
  return `${repoName}#${prNumber}`
}
