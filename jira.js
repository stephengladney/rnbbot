const slack = require("./slack")
const status = {
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
  //IN PROG > R4R
  if (
    oldStatus == status.inDevelopment &&
    newStatus == status.readyForCodeReview
  ) {
    slack.notify.readyForReview({
      cardNumber: cardNumber,
      cardTitle: cardTitle
    })
  }
  // R4QA
  if (newStatus == status.readyForQa) {
    slack.notify.readyForQA({
      cardNumber: cardNumber,
      cardTitle: cardTitle
    })
  }
}

module.exports = {
  processChange: processChange
}
