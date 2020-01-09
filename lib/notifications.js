const { designer, qaEngineer, productManager } = require("../team")
const { ordinal } = require("./numbers")
<<<<<<< HEAD
const { atHere, atMention } = require("./slack")

function truncateTitle(title) {
  return String(title).length <= 50
    ? title
    : `${String(title).substr(0, 50)}...`
=======
const {
  jiraSettings,
  slackSettings: { emojis }
} = require("../settings")

const atHere = "<!here|here>"
const atMention = person =>
  person.slackHandle ? `<@${person.slackHandle}>` : ``

function isNotifyEnabled({ status }) {
  return !jiraSettings[status] ? false : jiraSettings[status]
>>>>>>> 7fb7dbfb5bf39e2591967c9a70e1a70e40565d00
}

function notifyMessage({ cardNumber, cardTitle, currentStatus }) {
  const truncatedTitle = truncateTitle(cardTitle, 50)
  switch (currentStatus) {
    case "Ready for Acceptance":
      return `${emojis.readyForAcceptance} | ${
        emojis.jira
<<<<<<< HEAD
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for acceptance* | ${atMention(
        productManager
      )}`
=======
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\`
         is *ready for acceptance* | ${atMention(productManager)}`

>>>>>>> 7fb7dbfb5bf39e2591967c9a70e1a70e40565d00
    case "Ready for Design Review":
      return `${emojis.readyForDesignReview} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for Design Review* | ${atMention(
        designer
      )}`
<<<<<<< HEAD
=======

>>>>>>> 7fb7dbfb5bf39e2591967c9a70e1a70e40565d00
    case "Ready for QA":
      return `${emojis.readyForQa} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for QA* | ${atMention(
        qaEngineer
      )}`
<<<<<<< HEAD
    case "Ready for Code Review":
      return `${emojis.readyForReview} | ${emojis.jira} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for review* | ${atHere}`
=======

    case "Ready for Code Review":
      return `${emojis.readyForReview} | ${emojis.jira} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for review* | ${atHere}`

>>>>>>> 7fb7dbfb5bf39e2591967c9a70e1a70e40565d00
    case "Ready for Merge":
      return `${emojis.readyforMerge} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for merge* | ${atMention(
        assignee
      )}`
    default:
<<<<<<< HEAD
      return `:grimacing: Notify is enabled for this status, but no message defined: \`${currentStatus}\``
=======
      return `:grimacing: Notification is enabled for this status, but no message specified. <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}>`
>>>>>>> 7fb7dbfb5bf39e2591967c9a70e1a70e40565d00
  }
}

function remindMessage({
<<<<<<< HEAD
  alertCount,
  cardNumber,
  cardTitle,
  currentStatus,
  lastColumnChangeTime
}) {
  const truncatedTitle = truncateTitle(cardTitle, 50)
  // NEED TO CALCULATE AGE
  switch (currentStatus) {
    case "Ready for Acceptance":
      return `${emojis.readyForAcceptance} ${ordinal(nthAlert)} reminder | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}
              )}\` has been *ready for acceptance* for *${age}* | ${atMention(
        productManager
      )}`
    case "Ready for Merge":
      return `${readyforMerge} ${ordinal(nthAlert)} reminder | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}
              )}\` has been *ready for merge* for *${age}* | ${atMention(
        productManager
      )}`
    case "Ready for Code Review":
      return `${emojis.readyForReview} ${ordinal(nthAlert)} reminder | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}
              )}\` has been *ready for review* for *${age}* | ${atMention(
        productManager
      )}`
    default:
      return `:grimacing: Remind is enabled for this status, but no message defined: \`${currentStatus}\``
  }
}

module.exports = {
=======
  age,
  alertCount,
  cardNumber,
  currentStatus,
  cardTitle,
  lastColumnChangeTime
}) {
  const truncatedTitle = truncateTitle(cardTitle, 50)
  switch (currentStatus) {
    case "Ready for Acceptance":
      return `${emojis.readyForAcceptance} ${ordinal(alertCount)} reminder | ${
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
      return `${emojis.readyForReview} ${ordinal(alertCount)} reminder | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` has been *ready for review* for *${age}* | ${atHere()}
      `
  }
}

function truncateTitle(title, length) {
  return String(title).length <= length
    ? title
    : `${String(title).substr(0, length)}...`
}

module.exports = {
  isNotifyEnabled,
>>>>>>> 7fb7dbfb5bf39e2591967c9a70e1a70e40565d00
  notifyMessage,
  remindMessage
}
