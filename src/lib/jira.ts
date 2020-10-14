import moment from "moment"
import axios from "axios"
import { hours, isPast } from "./numbers"
import { isWithinSlackHours, sendEphemeral, sendMessage } from "./slack"
import { isNotifyEnabled, notifications } from "./notifications"
import { jiraSettings } from "../settings"
import { findPullRequests } from "./github"
require("dotenv").config()

export type Status =
  | "Unassigned"
  | "In Development"
  | "Ready for Code Review"
  | "Ready for Design Review"
  | "Ready for QA"
  | "Ready for Acceptance"
  | "Ready for Merge"
  | "Done"
  | string
export interface CardData {
  age?: string
  alertCount?: number
  assignee: string
  cardNumber: string
  cardTitle: string
  currentStatus: Status
  lastColumnChangeTime?: number
  nextAlertTime?: number
  previousStatus: string
  pullRequests: []
  teamAssigned: string
}

export type StagnantCards = CardData[]

export interface JiraPayloadBody {
  changelog: {
    items: { fieldId: string; fromString: string; toString: string }[]
  }
  issue: {
    fields: {
      assignee: { displayName: string }
      customfield_10025: { value: string }
      summary: string
    }
    key: string
  }
}

export async function composeAndSendMessage({
  cardData,
  event,
}: {
  cardData: CardData
  event: "entry" | "stagnant"
}) {
  const whoReceivesEphemeral = (status: string) => {
    switch (status) {
      case "Ready for QA":
        return 1
      case "Ready for Acceptance":
        return productManager
      case "Ready for Design Review":
        return designer
      default:
        return findTeamMemberByFullName(cardData.assignee)
    }
  }
  //@ts-ignore
  const methodFromSettings = jiraSettings[cardData.currentStatus].method
  const message = await notifications({ ...cardData, event })
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
      user: whoReceivesEphemeral(cardData.currentStatus),
    })
  }
}

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

  const cardData = {
    assignee: body.issue.fields.assignee.displayName,
    cardNumber: body.issue.key,
    cardTitle: body.issue.fields.summary,
    currentStatus: body.changelog.items[0].toString,
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

  isNotifyEnabled({ status: cardData.currentStatus }).notifyOnEntry &&
    composeAndSendMessage({ cardData, event: "entry" })

  isNotifyEnabled({ status: cardData.currentStatus }).monitorForStagnant &&
    addToStagnants({
      cardData: cardData,
      stagnantCards: stagnantCards,
    })
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

export function checkforStagnants(arr: StagnantCards) {
  if (!isWithinSlackHours()) return
  arr.forEach((card: CardData) => {
    if (isPast(card.nextAlertTime)) {
      card.alertCount && card.alertCount++
      card.nextAlertTime = Date.now() + hours(2)
      card.age = moment().from(card.lastColumnChangeTime, true)
      composeAndSendMessage({ cardData: card, event: "stagnant" })
    }
  })
}
