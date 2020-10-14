import Person, { PersonProps } from "../models/person"
import { ordinal } from "./numbers"

import { jiraSettings, slackSettings } from "../settings"
import { extractLabelFromPullRequestUrl } from "./github"
import { Status } from "./jira"

const { emojis } = slackSettings

interface NotificationParams {
  age?: string
  alertCount?: number
  assignee: string
  cardNumber: string
  cardTitle: string
  currentStatus: string
  event: "entry" | "stagnant"
  pullRequests: string[]
  teamAssigned: string
}

const atHere = "<!here|here>"
const atMention = (person: PersonProps) =>
  person.slackHandle ? `<@${person.slackHandle}>` : ``

const buildPullRequestLink = (pullRequest: string) =>
  `${emojis.github} <${pullRequest}|${extractLabelFromPullRequestUrl(
    pullRequest
  )}>`

export function isNotifyEnabled({ status }: { status: Status }) {
  return !jiraSettings[status] ? false : jiraSettings[status]
}

export const notifications = async ({
  age,
  alertCount,
  assignee,
  cardNumber,
  cardTitle,
  currentStatus,
  event,
  pullRequests,
  teamAssigned,
}: NotificationParams): Promise<string> => {
  const truncatedTitle = truncateTitle(cardTitle, 50)

  const jiraLink = !!cardNumber
    ? `${emojis.jira} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}>`
    : `${emojis.jira} N/A`

  const githubLinks =
    pullRequests.map(buildPullRequestLink).join(" ") || `${emojis.github} N/A`

  const stagnantReminder =
    event === "stagnant" ? `${ordinal(alertCount || 1)}  reminder | ` : ""

  const notificationMessage =
    event === "stagnant"
      ? `has been *${currentStatus.toLowerCase()}* for *${age}*`
      : `is *${currentStatus.toLowerCase()}*`

  const roleToMention = {
    "Ready for Acceptance": "product",
    "Ready for Design Review": "design",
    "Ready For QA": "qa",
    "Ready for Merge": "engineer",
  }

  const whoToMention = await Person.findByTeamAndRole({
    roleName: roleToMention[currentStatus],
    teamName: teamAssigned,
  })

  return `${emojis[currentStatus]} | ${stagnantReminder}
    ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` ${notificationMessage} | ${whoToMention}`
}

function truncateTitle(title: string, length: number) {
  return String(title).length <= length
    ? title
    : `${String(title).substr(0, length)}...`
}
