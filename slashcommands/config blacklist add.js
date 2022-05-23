const { SlashCommandBuilder } = require("@discordjs/builders")
const Enmap = require('enmap');
const settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
});

const run = async (client, interaction) => {
    // get the channel to be blacklisted and server key
    let channelToBlacklist = interaction.options.getString("channel")
    let key = `${interaction.guild.id}`;
    try {
        // Channel's already blacklisted.
        if (!settings.get(interaction.guild.id, "blacklistedChannels").indexOf(channelToBlacklist) == -1) {
            return interaction.reply(`That channel is already blacklisted!`)
        }
        // Channel found and is not already blacklisted.
        else if(interaction.guild.channels.cache.find(channel => channel.name === channelToBlacklist)) {
            settings.push(key, channelToBlacklist, "blacklistedChannels");
        }
        // Channel can't be found.
        else{
            return interaction.reply(`The channel couldn't be found! Perhaps you made a typo?`)
        }
        
    } catch (error) {
        console.error('Error trying to edit blacklist: ', error);
        return interaction.reply('Failed to edit blacklist: ' + error + ', please yell at the developer because this is a serious issue.')
    }
    return interaction.reply(`Succesfully blacklisted ${channelToBlacklist}`)
}

module.exports = {
    data: new SlashCommandBuilder().setName("blacklist-add").setDescription("Adds a channel to the blacklist, cuasing Stilte to skip that channel"),
    name: "blacklist-add",
    description: "Adds a channel to the blacklist, causing Stilte to skip that channel.",
    perm: "manageperms",
    options: [
        {
            name: "channel",
            description: "The channel to blacklist",
            type: "STRING",
            required: true
        },
    ],
    run
}
