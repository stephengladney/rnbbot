const jiraSettings = {
  Unassigned: {
    notifyOnEntry: false,
    monitorForStagnant: false
  },
  "In Development": {
    notifyOnEntry: false,
    monitorForStagnant: false
  },
  "Ready for Code Review": {
    notifyOnEntry: true,
    monitorForStagnant: true
  },
  "Ready for Design Review": {
    notifyOnEntry: true,
    monitorForStagnant: false
  },
  "Ready for QA": {
    notifyOnEntry: true,
    monitorForStagnant: false
  },
  "Ready for Acceptance": {
    notifyOnEntry: true,
    monitorForStagnant: false
  },
  "Ready for Merge": {
    notifyOnEntry: true,
    monitorForStagnant: true
  },
  Done: {
    notifyOnEntry: false,
    monitorForStagnant: false
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
    stop: 17
  },
  emojis: {
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
  slackSettings: slackSettings,
  jiraSettings: jiraSettings,
  timezoneOffset: timezoneOffset
}
