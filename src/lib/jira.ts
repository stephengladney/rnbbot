import moment from "moment"
import axios from "axios"
import { hours, isPast } from "./numbers"
import { handleEntryNotification, composeAndSendMessage } from "./notifications"
import { isWithinSlackHours } from "./slack"
import { jiraSettings } from "../settings"
import { findPullRequests } from "./github"
import { Status, CardData, StagnantCards, JiraPayloadBody } from "./jira.types"
import Team from "../models/team"
import Configuration from "../models/configuration"
import { convertCase } from "./case"
import { logError } from "./logging"
require("dotenv").config()

export async function processWebhook({
  body,
  stagnantCards,
}: {
  body: JiraPayloadBody
  stagnantCards: StagnantCards
}) {
  const fieldThatChanged = body?.changelog?.items[0].fieldId || ""
  const teamAssigned = body.issue.fields.customfield_10025
    ? body.issue.fields.customfield_10025.value
    : "No team assigned"

  if (fieldThatChanged !== "status" || teamAssigned !== teamName) return

  const foundPullRequests = await findPullRequests(body.issue.key.substr(3))

  const cardData: CardData = {
    assignee: body.issue.fields.assignee.displayName,
    cardNumber: body.issue.key,
    cardTitle: body.issue.fields.summary,
    currentStatus: body.changelog.items[0].toString as Status,
    previousStatus: body.changelog.items[0].fromString,
    pullRequests: foundPullRequests.some((pr: string) => pr.includes("Error"))
      ? []
      : foundPullRequests,
    teamAssigned,
  }

  removeFromStagnants({
    cardData,
    stagnantCards,
  })

  try {
    const teamSettings = await getTeamAndSettingForStatus({
      status: cardData.currentStatus,
      teamName: cardData.teamAssigned,
    })

    if (!teamSettings) throw "No team settings returned"

    if (teamSettings.monitorForStagnant) {
      addToStagnants({
        cardData: cardData,
        stagnantCards: stagnantCards,
      })
    }

    if (teamSettings.notifyOnEntry)
      handleEntryNotification({ cardData, teamSettings })
  } catch (err) {
    logError(`jira.processWebbhook: ${err}`)
  }
}

export function removeFromStagnants({
  cardData,
  stagnantCards,
}: {
  cardData: CardData
  stagnantCards: StagnantCards
}) {
  const cardIndex = stagnantCards.findIndex(
    (card: CardData) => card.cardNumber === cardData.cardNumber
  )
  if (cardIndex !== -1) stagnantCards.splice(cardIndex, 1)
}

export function findStagnants(query: string, stagnantCards: StagnantCards) {
  return (
    stagnantCards.filter((card: CardData) =>
      card.cardTitle.toLowerCase().includes(query.toLowerCase())
    ) || []
  )
}

export async function getTeamAndSettingForStatus({
  status,
  teamName,
}: {
  status: Status
  teamName: string
}) {
  try {
    const team = await Team.findByName({ name: teamName })
    if (!team) throw `No team by the name ${teamName} found`

    //@ts-ignore - still not recognizing attributes on db models
    const configuration = await Configuration.findByTeamId({ teamId: team.id })
    const statusKeyPrefix = convertCase(status).toSnake()
    return {
      //@ts-ignore - still not recognizing attributes on db models
      method: configuration[`${statusKeyPrefix}_method`],
      //@ts-ignore - still not recognizing attributes on db models
      notifyOnEntry: configuration[`${statusKeyPrefix}_notify_on_entry`],
      monitorForStagnant:
        //@ts-ignore - still not recognizing attributes on db models
        configuration[`${statusKeyPrefix}_monitor_for_stagnants`],
      team,
    }
  } catch (err) {
    logError(`jira.getTeamSettingForStatus: ${err}`)
    return undefined
  }
}

export function addToStagnants({
  cardData,
  stagnantCards,
}: {
  cardData: CardData
  stagnantCards: StagnantCards
}) {
  const currentStatus = cardData.currentStatus
  //@ts-ignore
  if (jiraSettings[currentStatus].monitorForStagnant) {
    const timeStamp = Date.now()
    stagnantCards.push({
      ...cardData,
      alertCount: 1,
      nextAlertTime: timeStamp + hours(2),
      lastColumnChangeTime: timeStamp,
    })
  }
}

export function getJiraCard(cardNumber: string) {
  return axios.get(
    `https://salesloft.atlassian.net/rest/api/2/issue/${cardNumber}`,
    {
      headers: {
        Authorization: "Basic " + process.env.JIRA_TOKEN,
        header: "Accept: application/json",
      },
    }
  )
}

export async function checkforStagnants(arr: StagnantCards) {
  if (!isWithinSlackHours()) return
  arr.forEach(async (card: CardData) => {
    if (isPast(card.nextAlertTime)) {
      card.alertCount && card.alertCount++
      card.nextAlertTime = Date.now() + hours(2)
      card.age = moment().from(card.lastColumnChangeTime, true)

      try {
        const team = await Team.findByName({ name: card.teamAssigned })
        if (!team) throw `No team found with name ${card.teamAssigned}`
        composeAndSendMessage({ cardData: card, event: "stagnant", team })
      } catch (err) {
        logError(`jira.checkForStagnants.Team.findByName: ${err}`)
      }
    }
  })
}
