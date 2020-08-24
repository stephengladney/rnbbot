const { designer, qaEngineer, productManager } = require("../../team")
const { ordinal } = require("./numbers")
const {
  jiraSettings,
  slackSettings: { emojis },
} = require("../../settings")
const { extractLabelFromPullRequestUrl } = require("./github")

const atHere = "<!here|here>"
const atMention = (person) =>
  person.slackHandle ? `<@${person.slackHandle}>` : ``
const buildPullRequestLink = (pullRequest) =>
  `${emojis.github} <${pullRequest}|${extractLabelFromPullRequestUrl(
    pullRequest
  )}>`

function isNotifyEnabled({ status }) {
  return !jiraSettings[status] ? false : jiraSettings[status]
}

const notifications = ({
  age,
  alertCount,
  assignee,
  cardNumber,
  cardTitle,
  currentStatus,
  messageType,
  pullRequests,
}) => {
  const truncatedTitle = truncateTitle(cardTitle, 50)
  const jiraLink = !!cardNumber
    ? `${emojis.jira} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}>`
    : `${emojis.jira} N/A`
  const githubLinks =
    pullRequests.map(buildPullRequestLink).join(" ") || `${emojis.github} N/A`

  const stagnantReminder =
    messageType == "stagant" ? `${ordinal(alertCount)}  reminder | ` : ""

  const notificationMessage =
    messageType == "stagnant"
      ? `has been *${currentStatus.toLowerCase()}* for *${age}*`
      : `is *${currentStatus.toLowerCase()}*`

  const whoToMention = {
    "Ready for Acceptance": atMention(productManager),
    "Ready for Design Review": atMention(designer),
    "Ready For QA": atMention(qaEngineer),
    "Ready for Review": atHere,
    "Ready for Merge": atMention(assignee),
  }

  return `${emojis[currentStatus]} | ${stagnantReminder}
    ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` ${notificationMessage} | ${whoToMention(
    currentStatus
  )}`
}

function truncateTitle(title, length) {
  return String(title).length <= length
    ? title
    : `${String(title).substr(0, length)}...`
}

module.exports = {
  isNotifyEnabled,
  notifications,
}
