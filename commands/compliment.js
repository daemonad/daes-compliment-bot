exports.run = (bot, targetGuildID, targetChannelID, memberName) => {
  const guild = bot.guilds.find('id', targetGuildID)
  const channel = guild.channels.find('id', targetChannelID)
  channel.send(`${memberName} is awesome.`)
}
