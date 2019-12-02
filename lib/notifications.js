const { sendMessage } = require("./slack")
const {
  designer,
  qaEngineer,
  productManager,
  slackChannel
} = require("../team")
const {
  slackSettings: { emojis }
} = require("../settings")

module.exports = {
  notify: notify,
  remind: remind
}
