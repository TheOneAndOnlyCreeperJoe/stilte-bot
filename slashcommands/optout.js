const { SlashCommandBuilder } = require("@discordjs/builders")
const Enmap = require('enmap');

const run = async (client, interaction) => {
    //because of issues staying up to date, we are getting the optoutList inside of the run
    const optoutList = new Enmap({
        name: "optoutList",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep'
    })

    const key = `${interaction.guild.id}-${interaction.member.id}`;
    try {
        if (optoutList.has(key)) { //Delete the key if he's opted out already.
            optoutList.delete(key);
            return interaction.reply({ content: `You are no longer opted out of gagging.`, ephemeral: true })
        }
        else { // Add his key if he's not opted out.
            optoutList.set(key, interaction.member.id, "user")
            optoutList.set(key, interaction.guild.id, "guild")
            return interaction.reply({ content: `You have been opted out of gagging.`, ephemeral: true })
        }
    } catch (error) {
        console.error(`Error trying to opt in or out in ${message.guild.name} - ${message.guild.id}: `, error);
        return interaction.reply(`Failed to opt in or out in ${message.guild.name} - ${message.guild.id}: ${error} please yell at the developer as this is a serious issue.`)
    }
    return interaction.reply(`${interaction.member.user} has used the safeword!`)
}

module.exports = {
    data: new SlashCommandBuilder().setName("optout").setDescription("Opt-out, preventing users from gagging you, or opt back in. Requires /safeword being enabled."),
    name: "optout",
    description: "Opt-out, preventing users from gagging you, or opt back in. Requires /safeword being enabled.",
    run
}