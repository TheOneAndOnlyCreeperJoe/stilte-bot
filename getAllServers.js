const { Client, Intents, Collection } = require('discord.js');
require("dotenv").config()

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  allowedMentions: [{ repliedUser: false }],
});

let bot = {
  client,
};

client.login(process.env.TOKEN);