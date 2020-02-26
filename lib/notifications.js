const { designer, qaEngineer, productManager } = require("../team")
const { ordinal } = require("./numbers")
const {
  jiraSettings,
  slackSettings: { emojis }
} = require("../settings")
const { extractLabelFromPullRequestUrl } = require("./github")

const atHere = "<!here|here>"
const atMention = person =>
  person.slackHandle ? `<@${person.slackHandle}>` : ``
const buildPullRequestLink = pullRequest =>
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
  pullRequests
}) => {
  const truncatedTitle = truncateTitle(cardTitle, 50)
  const jiraLink = !!cardNumber
    ? `${emojis.jira} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}>`
    : `${emojis.jira} N/A`
  const githubLinks =
    pullRequests.map(buildPullRequestLink).join(" ") || `${emojis.github} N/A`

  return {
    entry: {
      channel: () => {
        switch (currentStatus) {
          case "Ready for Acceptance":
            return `${
              emojis.readyForAcceptance
            } | ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` is *ready for acceptance* | ${atMention(
              productManager
            )}`

          case "Ready for Design Review":
            return `${
              emojis.readyForDesignReview
            } | ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` is *ready for Design Review* | ${atMention(
              designer
            )}`

          case "Ready for QA":
            return `${
              emojis.readyForQa
            } | ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` is *ready for QA* | ${atMention(
              qaEngineer
            )}`

          case "Ready for Code Review":
            return `${emojis.readyForReview} | ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` is *ready for review* | ${atHere}`

          case "Ready for Merge":
            return `${
              emojis.readyforMerge
            } | ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` is *ready for merge* | ${atMention(
              assignee
            )}`

          default:
            return `:grimacing: Notification is enabled for this status, but no message specified. ${jiraLink}`
        }
      },
      ephemeral: () => {
        switch (currentStatus) {
          case "Ready for Acceptance":
            return `${emojis.readyForAcceptance} | ${jiraLink} ${githubLinks} | Hey ${productManager.firstName}, \`${truncatedTitle}\` is *ready for acceptance*`
          case "Ready for Design Review":
            return `${emojis.readyForDesignReview} | ${jiraLink} ${githubLinks} | Hey ${designer.firstName}, \`${truncatedTitle}\` is *ready for Design Review*`
          case "Ready for QA":
            return `${emojis.readyForQa} | ${jiraLink} ${githubLinks} | Hey ${qaEngineer.firstName}, \`${truncatedTitle}\` is *ready for QA*`
          case "Ready for Merge":
            return `${emojis.readyforMerge} | ${jiraLink} ${githubLinks} | Hey ${assignee.firstName}, \`${truncatedTitle}\` is *ready for merge*`
          default:
            return `:grimacing: Notification is enabled for this status, but no message specified. ${jiraLink}`
        }
      }
    },
    stagnant: {
      channel: () => {
        switch (currentStatus) {
          case "Ready for Acceptance":
            return `${emojis.readyForAcceptance} ${ordinal(
              alertCount
            )} reminder | ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` has been *ready for acceptance* for *${age}* | ${atMention(
              productManager
            )}`

          case "Ready for Merge":
            return `${emojis.readyforMerge} ${ordinal(
              alertCount
            )} reminder | ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` has been *ready for merge* for *${age}* | ${atMention(
              assignee
            )}`

          case "Ready for Code Review":
            return `${emojis.readyForReview} ${ordinal(
              alertCount
            )} reminder | ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` has been *ready for review* for *${age}* | ${atHere}
      `
        }
      },
      ephemeral: () => {
        switch (currentStatus) {
          case "Ready for Acceptance":
            return `${emojis.readyForAcceptance} ${ordinal(
              alertCount
            )} reminder | ${jiraLink} ${githubLinks} | Hey ${
              productManager.firstName
            }, \`${truncatedTitle}\` has been *ready for acceptance* for *${age}*`

          case "Ready for Merge":
            return `${emojis.readyforMerge} ${ordinal(
              alertCount
            )} reminder | ${jiraLink} ${githubLinks} | Hey ${
              assignee.firstName
            }, \`${truncatedTitle}\` has been *ready for merge* for *${age}*`
        }
      }
    }
  }
}

function truncateTitle(title, length) {
  return String(title).length <= length
    ? title
    : `${String(title).substr(0, length)}...`
}

module.exports = {
  isNotifyEnabled,
  notifications
}
