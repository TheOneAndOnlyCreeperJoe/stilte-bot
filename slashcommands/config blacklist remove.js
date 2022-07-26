const { SlashCommandBuilder } = require("@discordjs/builders")
const Enmap = require('enmap');
const settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
});

const run = async (client, interaction) => {
    // get the channel to be unblacklisted and server key
    let channelToBlacklist = interaction.options.getString("channel")
    if (channelToBlacklist.slice(0, 2) == '<#') {
        channelToBlacklist = channelToBlacklist.substring(2)
        channelToBlacklist = channelToBlacklist.substring(0, channelToBlacklist.length - 1)
        let storedChannel = interaction.guild.channels.cache.get(channelToBlacklist)
        channelToBlacklist = storedChannel.name
    }
    let key = `${interaction.guild.id}`;
    try {
        // Channel can't be found.
        if(!interaction.guild.channels.cache.find(channel => channel.name === channelToBlacklist)) {
            return interaction.reply(`The channel couldn't be found! Perhaps you made a typo?`)
        }
        // Channel found and is not blacklisted.
        else if (settings.get(interaction.guild.id, "blacklistedChannels").indexOf(channelToBlacklist) == -1) {
            return interaction.reply(`That channel is not blacklisted!`)
        }
        // Channel found and is blacklisted.
        else {
            settings.remove(key, channelToBlacklist, "blacklistedChannels");
        }
    } catch (error) {
        console.error('Error trying to edit blacklist: ', error);
        return interaction.reply('Failed to edit blacklist: ' + error + ', please yell at the developer because this is a serious issue.')
    }
    return interaction.reply(`Succesfully unblacklisted ${channelToBlacklist}`)
}

module.exports = {
    data: new SlashCommandBuilder().setName("blacklist-remove").setDescription("Removes a channel to the blacklist, causing Stilte to no longer skip that channel."),
    name: "blacklist-remove",
    description: "Removes a channel to the blacklist, causing Stilte to no longer skip that channel.",
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
