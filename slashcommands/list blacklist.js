
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Enmap = require('enmap');

const run = async (client, interaction) => {
    //because of issues staying up to date, we are getting it inside of the run
    const settings = new Enmap({ 
        name: "settings",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
    });

    let key = `${interaction.guild.id}`;
    const blacklistedChannels = settings.get(interaction.guild.id, "blacklistedChannels")
    const embed = new MessageEmbed()
        .setTitle("Blacklist")
        .setColor(0x000000);
    for (const data of blacklistedChannels) {
        // Loops through each entry of list and adds a line in the embed for each one.
            embed.addField('\u200B', data, true);
    }
    return interaction.reply({embeds: [embed], ephemeral: true })
}

module.exports = {
    data: new SlashCommandBuilder().setName("list-blacklist").setDescription("Lists the channels that are blacklisted from Stilte"),
    name: "list-blacklist",
    description: "Lists the channels that are blacklisted from Stilte",
    run
}
