
/* const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
});

const run = async (client, interaction) => {
   
    let botchannel = interaction.options.getString("bot-channel")
    let serverKey = `${interaction.guild.id}`;
    try {
        settings.set(serverKey, botchannel, "botLogChannel");
    } catch (error) {
        console.error('Error trying to edit bot-channel: ', error);
        return interaction.reply('Failed to edit bot-channel: ' + error + ', please yell at the developer because this is a serious issue.')
    }

    return interaction.reply(`Bot channel has succesfully been changed to ${botchannel}`)
}

module.exports = {
    name: "configbotchannel",
    description: "Sets the channel where the bot will dump their debug, including gag-translations.",
    perm: "manageperms", //"MANAGE_GUILD" || "ADMINISTRATOR", //set to `${manageperm}`, later
    options: [
        {
            name: "bot-channel",
            description: "The channel where the bot will dump logs.",
            type: "STRING",
            required: true
        },
    ],
    run
}
*/