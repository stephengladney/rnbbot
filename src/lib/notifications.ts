const { designer, qaEngineer, productManager } = require("../../team")
const { ordinal } = require("./numbers")
const {
  jiraSettings,
  slackSettings: { emojis },
} = require("../../settings")
import { extractLabelFromPullRequestUrl } from "./github"

interface Person {
  firstName: string
  lastName: string
  email: string
  slackHandle: string
  slackId: string
}

interface NotificationParams {
  age: string
  alertCount: number
  assignee: Person
  cardNumber: string
  cardTitle: string
  currentStatus: string
  messageType: "entry" | "stagnant"
  pullRequests: any[]
}

const atHere = "<!here|here>"
const atMention = (person: Person) =>
  person.slackHandle ? `<@${person.slackHandle}>` : ``
const buildPullRequestLink = (pullRequest: string) =>
  `${emojis.github} <${pullRequest}|${extractLabelFromPullRequestUrl(
    pullRequest
  )}>`

export function isNotifyEnabled({ status }: { status: string }) {
  return !jiraSettings[status] ? false : jiraSettings[status]
}

export const notifications = ({
  age,
  alertCount,
  assignee,
  cardNumber,
  cardTitle,
  currentStatus,
  messageType,
  pullRequests,
}: NotificationParams) => {
  const truncatedTitle = truncateTitle(cardTitle, 50)

  const jiraLink = !!cardNumber
    ? `${emojis.jira} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}>`
    : `${emojis.jira} N/A`

  const githubLinks =
    pullRequests.map(buildPullRequestLink).join(" ") || `${emojis.github} N/A`

  const stagnantReminder =
    messageType === "stagnant" ? `${ordinal(alertCount)}  reminder | ` : ""

  const notificationMessage =
    messageType == "stagnant"
      ? `has been *${currentStatus.toLowerCase()}* for *${age}*`
      : `is *${currentStatus.toLowerCase()}*`

  const whoToMention = (status: string) => {
    switch (status) {
      case "Ready for Acceptance":
        return atMention(productManager)
      case "Ready for Design Review":
        return atMention(designer)
      case "Ready For QA":
        return atMention(qaEngineer)
      case "Ready for Merge":
        return atMention(assignee)
      default:
        return atHere
    }
  }

  return `${emojis[currentStatus]} | ${stagnantReminder}
    ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` ${notificationMessage} | ${whoToMention(
    currentStatus
  )}`
}

function truncateTitle(title: string, length: number) {
  return String(title).length <= length
    ? title
    : `${String(title).substr(0, length)}...`
}
