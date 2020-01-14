const fs = require('fs')
const path = require('path')
const handleError = require('../handlers/errorHandler.js')
const colors = require('../config/colors.json')


exports.run = (bot, message) => {
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
  let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  const channel = message.channel
  settings.targetChannelID = channel.id
  fs.writeFile(filepath, JSON.stringify(settings), err => {
    if (!err) message.channel.send({
      embed: {
        title: `Active channel was successfully set to ${channel}`,
        color: parseInt(colors.green)
      }
    })
  })
}