const { designer, qaEngineer, productManager } = require("../team")
const { ordinal } = require("./numbers")
const {
  jiraSettings,
  slackSettings: { emojis }
} = require("../settings")

const atHere = "<!here|here>"
const atMention = person =>
  person.slackHandle ? `<@${person.slackHandle}>` : ``

function isNotifyEnabled({ status }) {
  return !jiraSettings[status] ? false : jiraSettings[status]
}

const notifications = ({ assignee, cardNumber, cardTitle, currentStatus }) => {
  const truncatedTitle = truncateTitle(cardTitle, 50)
  return {
    entry: {
      channel: () => {
        switch (currentStatus) {
          case "Ready for Acceptance":
            return `${emojis.readyForAcceptance} | ${
              emojis.jira
            } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for acceptance* | ${atMention(
              productManager
            )}`

          case "Ready for Design Review":
            return `${emojis.readyForDesignReview} | ${
              emojis.jira
            } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for Design Review* | ${atMention(
              designer
            )}`
          case "Ready for QA":
            return `${emojis.readyForQa} | ${
              emojis.jira
            } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for QA* | ${atMention(
              qaEngineer
            )}`

          case "Ready for Code Review":
            return `${emojis.readyForReview} | ${emojis.jira} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for review* | ${atHere}`

          case "Ready for Merge":
            return `${emojis.readyforMerge} | ${
              emojis.jira
            } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for merge* | ${atMention(
              assignee
            )}`
          default:
            return `:grimacing: Notification is enabled for this status, but no message specified. <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}>`
        }
      }
    },
    stagnant: {
      channel: () => {
        switch (currentStatus) {
          case "Ready for Acceptance":
            return `${emojis.readyForAcceptance} ${ordinal(
              alertCount
            )} reminder | ${
              emojis.jira
            } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` has been *ready for acceptance* for *${age}* | ${atMention(
              productManager
            )}`

          case "Ready for Merge":
            return `${emojis.readyforMerge} ${ordinal(alertCount)} reminder | ${
              emojis.jira
            } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` has been *ready for merge* for *${age}* | ${atMention(
              productManager
            )}`

          case "Ready for Code Review":
            return `${emojis.readyForReview} ${ordinal(
              alertCount
            )} reminder | ${
              emojis.jira
            } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` has been *ready for review* for *${age}* | ${atHere}
      `
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
