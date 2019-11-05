const slack = require("./slack")
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
  // R4R
  if (newStatus == status.readyForCodeReview) {
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
  // R4DR
  if (newStatus == status.designReview) {
    //x
  }
  //R4A
  if (newStatus == status.readyForAcceptance) {
    //x
  }
  //R4M
  if (newStatus == status.readyForMerge) {
    slack.notify.readyForMerge({
      cardNumber: cardNumber,
      cardTitle: cardTitle,
      engineer: assignee
    })
  }
}

module.exports = {
  processChange: processChange
}
