const status = {
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

module.exports = {
  status: status
}
