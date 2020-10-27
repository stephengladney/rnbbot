import { Status } from "./lib/jira.types"
export const jiraSettings = {
  Unassigned: {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: false,
  },
  "In Development": {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: false,
  },
  "Ready for Code Review": {
    method: "channel", // Only "channel" is allowed here
    monitorForStagnant: true,
    notifyOnEntry: true,
  },
  "Ready for Design Review": {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: true,
  },
  "Ready for QA": {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: true,
  },
  "Ready for Acceptance": {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: false,
  },
  "Ready for Merge": {
    method: "ephemeral",
    monitorForStagnant: true,
    notifyOnEntry: true,
  },
  Done: {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: false,
  },
}

export const slackSettings = {
  days: {
    Sunday: false,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
  },
  hours: {
    start: 9,
    stop: 17,
  },
}
export const timezoneOffset = -4 // UTC

interface Emojis {
  error: string
  ignore: string
  jira: string
  github: string
  "Ready for Acceptance": string
  "Ready for Design Review": string
  "Ready For QA": string
  "Ready for Review": string
  "Ready for Merge": string
}

export const emojis = {
  error: ":exclamation:",
  ignore: ":see_no_evil:",
  jira: ":jira2:",
  github: ":github:",
}

export const statusEmojis = (status: Status) => {
  switch (status) {
    case "Ready for Acceptance":
      return ":parking:"
    case "Ready for Design Review":
      return ":pencil2:"
    case "Ready for QA":
      return ":in_qa:"
    case "Ready for Code Review":
      return ":eyes:"
    case "Ready for Merge":
      return ":white_check_mark:"
    default:
      return ""
  }
}
