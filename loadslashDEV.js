const { Client, Intents, Collection } = require('discord.js');
require("dotenv").config()

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  allowedMentions: [{ repliedUser: false }],
});

let bot = {
  client,
};

client.slashcommands = new Collection();

client.loadSlashCommands = (bot, reload) => require('./handlers/slashcommands')(bot, reload);
client.loadSlashCommands(bot, false);

client.on('ready', async () => {
  console.log('Started refreshing application (/) commands.');

  await client.application.commands.set([...client.slashcommands.values()]);
  console.log('Successfully reloaded application (/) commands.');
  process.exit(0);
});

client.login(process.env.DEVTOKEN);