const {
  notify: {
    readyForAcceptance,
    readyForDesignReview,
    readyForMerge,
    readyForQA,
    readyForReview
  }
} = require("./slack")

const r4DesignReview = "Design Review"
const inDevelopment = "In Development"
const r4CodeReview = "Ready for Code Review"
const r4Qa = "Ready for QA"
const r4Acceptance = "Ready for Acceptance"
const r4Merge = "Ready for Merge"
const merged = {
  newStatus: "Done",
  oldStatus: "Merged"
}
const GA = "GA"

function processChange({
  assignee,
  cardNumber,
  cardTitle,
  newStatus,
  oldStatus
}) {
  jiraData = {
    cardNumber: cardNumber,
    cardTitle: cardTitle,
    assignee: assignee
  }

  switch (newStatus) {
    case r4CodeReview:
      readyForReview(jiraData)
      break
    case r4Qa:
      readyForQA(jiraData)
      break
    case r4DesignReview:
      readyForDesignReview(jiraData)
      break
    case r4Acceptance:
      readyForAcceptance(jiraData)
      break
    case r4Merge:
      readyForMerge(jiraData)
    default:
  }
}

module.exports = {
  processChange: processChange
}
