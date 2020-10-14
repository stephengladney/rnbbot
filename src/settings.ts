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
  emojis: {
    error: ":exclamation:",
    ignore: ":see_no_evil:",
    jira: ":jira2:",
    github: ":github:",
    "Ready for Acceptance": ":parking:",
    "Ready for Design Review": ":pencil2:",
    "Ready For QA": ":in_qa:",
    "Ready for Review": ":eyes:",
    "Ready for Merge": ":white_check_mark:",
  },
}
export const timezoneOffset = -4 // UTC