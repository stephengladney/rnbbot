const jiraSettings = {
  Unassigned: {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: false
  },
  "In Development": {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: false
  },
  "Ready for Code Review": {
    method: "channel", // Only "channel" is allowed here
    monitorForStagnant: true,
    notifyOnEntry: true
  },
  "Ready for Design Review": {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: true
  },
  "Ready for QA": {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: true
  },
  "Ready for Acceptance": {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: false
  },
  "Ready for Merge": {
    method: "ephemeral",
    monitorForStagnant: true,
    notifyOnEntry: true
  },
  Done: {
    method: "ephemeral",
    monitorForStagnant: false,
    notifyOnEntry: false
  }
}

const slackSettings = {
  days: {
    Sunday: false,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false
  },
  hours: {
    start: 10,
    stop: 20
  },
  emojis: {
    error: ":exclamation:",
    ignore: ":see_no_evil:",
    jira: ":jira2:",
    github: ":github:",
    readyForAcceptance: ":parking:",
    readyForDesignReview: ":pencil2:",
    readyForQa: ":in_qa:",
    readyForReview: ":eyes:",
    readyforMerge: ":white_check_mark:"
  }
}
const timezoneOffset = -5 // UTC

module.exports = {
  slackSettings,
  jiraSettings,
  timezoneOffset
}
