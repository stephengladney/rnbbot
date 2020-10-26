import Person from "../models/person"
import Team from "../models/team"
import { ordinal } from "./numbers"
import { isWithinSlackHours, sendEphemeral, sendMessage } from "./slack"
import { jiraSettings, slackSettings, emojis, statusEmojis } from "../settings"
import { extractLabelFromPullRequestUrl } from "./github"
import { CardData, Status } from "./jira.types"
import { logError } from "./logging"

interface NotificationParams {
  age?: string
  alertCount?: number
  assignee: string
  cardNumber: string
  cardTitle: string
  currentStatus: Status
  event: "entry" | "stagnant"
  personToMention: Person
  pullRequests: string[]
  team: Team
}

interface TeamConfigurationForStatus {
  notifyOnEntry: boolean
  monitorForStagnant: boolean
  method: "channel" | "ephemeral"
  team: Team
}

const atHere = "<!here|here>"
const atMention = (person: Person) =>
  //@ts-ignore
  `<@${person.slack_handle}>`

const buildPullRequestLink = (pullRequest: string) =>
  `${emojis.github} <${pullRequest}|${extractLabelFromPullRequestUrl(
    pullRequest
  )}>`

export async function handleEntryNotification({
  cardData,
  teamSettings,
}: {
  cardData: CardData
  teamSettings: TeamConfigurationForStatus
}) {
  // get team settings, is notify enabled?
  // if so, compose and send appropriate message

  if (teamSettings.notifyOnEntry && isWithinSlackHours()) {
    composeAndSendMessage({ cardData, event: "entry", team: teamSettings.team })
  }
}

export async function getPersonToNotify({
  assignee,
  status,
  team,
}: {
  assignee: string
  status: Status
  team: Team
}) {
  const statusToRoleMap = {
    "Ready for Acceptance": "product",
    "Ready for Design Review": "design",
    "Ready for QA": "qa",
  }
  try {
    switch (status) {
      case "Ready for Acceptance":
      case "Ready for Design Review":
      case "Ready for QA":
        const person = await Person.findByTeamIdAndRole({
          //@ts-ignore
          teamId: team.id,
          roleName: statusToRoleMap[status],
        })

        if (!person[0])
          //@ts-ignore
          throw `${statusToRoleMap[status]} for team ${team.name} not found`
        else return person[0]

      default:
        const people = await Person.findByTeamIdAndRole({
          //@ts-ignore
          teamId: team.id,
          roleName: "engineer",
        })
        const engineer = people.find(
          //@ts-ignore
          (person) => assignee === `${person.first_name} ${person.last_name}`
        )
        if (!engineer) throw `Engineer not found: ${assignee}`
    }
  } catch (err) {
    logError(`notifications.getPersonToNotify: ${err}`)
  }
}

export const generateNotificationMessage = ({
  age,
  alertCount,
  assignee,
  cardNumber,
  cardTitle,
  currentStatus,
  event,
  pullRequests,
  personToMention,
}: NotificationParams): string => {
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

  const atMentionTag =
    currentStatus === "Ready for Code Review"
      ? atHere
      : atMention(personToMention)

  return `${statusEmojis(currentStatus)} | ${stagnantReminder}
    ${jiraLink} ${githubLinks} | \`${truncatedTitle}\` ${notificationMessage} | ${atMentionTag}`
}

function truncateTitle(title: string, length: number) {
  return String(title).length <= length
    ? title
    : `${String(title).substr(0, length)}...`
}

export async function composeAndSendMessage({
  cardData,
  event,
  team,
}: {
  cardData: CardData
  event: "entry" | "stagnant"
  team: Team
}) {
  //@ts-ignore
  const methodFromSettings = jiraSettings[cardData.currentStatus].method
  try {
    const personToMention = (await getPersonToNotify({
      assignee: cardData.assignee,
      status: cardData.currentStatus,
      team,
    })) as Person

    const message = generateNotificationMessage({
      ...cardData,
      event,
      team,
      personToMention,
    })

    if (methodFromSettings === "channel") {
      sendMessage({
        channel: slackChannel,
        message,
      })
    }
    if (methodFromSettings === "ephemeral") {
      sendEphemeral({
        channel: slackChannel,
        message,
        //@ts-ignore
        userId: personToMention.slack_id,
      })
    }
  } catch (err) {
    logError(`notifications.composeAndSendMessage: ${err}`)
  }
}
