import Person from "../../models/person"
require("dotenv").config()
const axios = require("axios")
const { hours, humanizeDay } = require("../numbers")
const {
  slackSettings: {
    days,
    hours: { start: startTime, stop: stopTime },
  },
  timezoneOffset,
} = require("../../settings")

export interface SendMessageProps {
  channel: string
  ignoreHours?: boolean
  message: string
}

export interface SendEphemeralProps extends SendMessageProps {
  userId: string
}

export function isWithinSlackHours() {
  const timeStamp = Date.now() + hours(timezoneOffset)
  const currentHour: number = new Date(timeStamp).getHours()
  const currentDay = humanizeDay(new Date(timeStamp).getDay())

  if (!days[currentDay]) return false
  else if (currentHour < startTime || currentHour >= stopTime) return false
  else return true
}

export function sendMessage({ channel, ignoreHours = false, message }: SendMessageProps) {
  if (!isWithinSlackHours() && !ignoreHours) {
    console.log(`[outside of hours] ${message}`)
    return
  }
  axios({
    method: "post",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    },
    contentType: "application/x-www-form-urlencoded",
    data: { channel: channel, text: message },
  })
}

export function sendEphemeral({
  channel,
  message,
  userId,
}: SendEphemeralProps) {
  if (!isWithinSlackHours()) {
    console.log(`[outside of hours] ${message}`)
    return
  }
  axios({
    method: "post",
    url: "https://slack.com/api/chat.postEphemeral",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    },
    contentType: "application/x-www-form-urlencoded",
    data: {
      attachments: [],
      channel: channel,
      text: message,
      user: userId,
    },
  })
}
