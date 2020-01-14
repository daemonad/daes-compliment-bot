const Discord = require('discord.js')
const fs = require('fs')
const compliment = require('./commands/compliment.js')
const handleError = require('./handlers/errorHandler.js')
const settingsTemplate = require('./config/settingsTemplate.json')
require('dotenv').config()

const bot = new Discord.Client({
  autoReconnect: true
})

bot.on('message', message => {
  let folderpath = `${__dirname}/data/`
  let filename = `${message.guild.id}.json`
  let filepath = folderpath + filename

  if (message.author.bot) return
  // Settings file checker
  let prefix = process.env.PREFIX
  if (message.guild) {
    try {
      let settings = JSON.parse(fs.readFileSync(filepath, 'utf8'))
      prefix = settings.prefix
    } catch (e) {
      if (!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath)
      }
      fs.writeFileSync(filepath, JSON.stringify(settingsTemplate))
      handleError.run(bot, message, `The bot prefix has been reset to \`${process.env.PREFIX}\` due to an internal error`, `The required server configuration data could not be found`)
      console.log(e)
    }
  } else if (!message.guild && message.content.startsWith(prefix)) {
    return message.channel.send({
      embed: {
        color: parseInt(colors.yellow),
        description: 'You need to [add me to a server](https://discordapp.com/oauth2/authorize?client_id=356369928426749952&scope=bot&permissions=1007119423) for any of my commands to work mate!'
      }
    })
  }
  // 50% chance of compliment
  if (!message.content.startsWith(prefix)) {
    let d = Math.random()
    if (d > 0.80 && d < 0.85) {
      let settings = JSON.parse(fs.readFileSync(filepath, 'utf8'))
      let member = message.guild.members.random(1)
      while (member[0].user.bot) {
        member = message.guild.members.random(1)
      }
      compliment.run(bot, message.guild.id, settings.targetChannelID, member[0].displayName)
    }
    return
  }
  // other commands
  let args = message.content.slice(prefix.length).trim().split(/ +/g)
  let command = args.shift().toLowerCase()

  for (let i in args) {
    if (args[i].startsWith(prefix)) {
      args = 0
      command = 0
      return handleError.run(bot, message, `Incorrect Syntax for the command`, `You supplied the bot prefix as an parameter to the command. Please type \`${prefix}help\` to get the command guide delivered to your inbox.`)
    }
  }
  try {
    let commandFile = require(`./commands/${command}.js`)
    commandFile.run(bot, message, args)
  } catch (e) {
    console.log(e)
    handleError.run(bot, message, `Command not found`, `Please type \`${prefix}help\` to get the command guide delivered to your inbox.`)
  }
  //compliment.run(bot, message, ["459720661267513345", "daemon"])
})


bot.login(process.env.TOKEN)
