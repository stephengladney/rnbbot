const {
  notify: {
    readyForAcceptance,
    readyForDesignReview,
    readyForMerge,
    readyForQA,
    readyForReview
  }
} = require("./slack")
const status = {
  designReview: "Design Review",
  inDevelopment: "In Development",
  readyForCodeReview: "Ready for Code Review",
  readyForQa: "Ready for QA",
  readyForAcceptance: "Ready for Acceptance",
  readyForMerge: "Ready for Merge",
  merged: {
    newStatus: "Done",
    oldStatus: "Merged"
  },
  GA: "GA"
}
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

  // R4R
  if (newStatus == status.readyForCodeReview) {
    readyForReview(jiraData)
  }
  // R4QA
  if (newStatus == status.readyForQa) {
    readyForQA(jiraData)
  }
  // R4DR
  if (newStatus == status.designReview) {
    readyForDesignReview(jiraData)
  }
  //R4A
  if (newStatus == status.readyForAcceptance) {
    readyForAcceptance(jiraData)
  }
  //R4M
  if (newStatus == status.readyForMerge) {
    readyForMerge(jiraData)
  }
}

module.exports = {
  processChange: processChange
}
