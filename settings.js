const statusSettings = {
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

const slack = {
  days: {
    0: false, // Sunday
    1: true, // Monday
    2: true, // Tuesday
    3: true, // Wednesday
    4: true, // Thursday
    5: true, // Friday
    6: false // Saturday
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
  slack: slack,
  statusSettings: statusSettings,
  timezoneOffset: timezoneOffset
}
