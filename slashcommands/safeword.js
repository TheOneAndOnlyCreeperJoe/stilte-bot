const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const gaglist = new Enmap({
    name: "gaglist",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
})

const run = async (client, interaction) => {
    //because of issues staying up to date, we are getting the settings inside of the run
    const settings = new Enmap({
        name: "settings",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
    });

    const key = `${interaction.guild.id}-${interaction.member.id}`;
    //Establish embed response.
    const embed = new MessageEmbed()
    
    try {
        if (!gaglist.has(key))  return interaction.reply({content: `You're not gagged.`, ephemeral: true}) //User is not in the gaglist.
        else if((settings.get(interaction.guild.id, "toggleSafeword")) === 0) return interaction.reply({content: `The safeword is disabled.`, ephemeral: true})//toggle-safewords is false
        else gaglist.delete(key); // We're all good, remove that gag.
    } catch (error) { // I genuinely hope this never happens.
        console.error('Error trying to safeword: ', error);
        embed.setColor(0xe61b00)
        embed.addField('Error!', 'Failed to use safeword: ' + error + ', please yell at the developer, as this is a serious issue.', true);
        return interaction.reply({ embeds: [embed] })
    }
    embed.setColor(0xfafafa)
    embed.addField('Safeword!', `${interaction.member.user} has used the safeword!`, true);
    return interaction.reply({ embeds: [embed] })
}

module.exports = {
    data: new SlashCommandBuilder().setName("safeword").setDescription("Ungags yourself."),
    name: "safeword",
    description: "Ungags yourself.",
    run
}