const fs = require('fs')
const path = require('path')
const colors = require('../config/colors.json')

exports.run = (bot, message) => {
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
  let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  let targetChannel = "No channel set"
  if (settings.targetChannelID) {
    targetChannel= message.guild.channels.find('id', settings.targetChannelID)
  }
  return message.channel.send({
    embed: {
      title: `Settings`,
      description: `Here are my settings for your server`,
      color: parseInt(colors.blue),
      fields: [
        {
          name: 'Prefix',
          value: settings.prefix
        },
        {
          name: 'Target Channel',
          value: targetChannel.name,
          inline: true
        }
      ]
    }
  })
}