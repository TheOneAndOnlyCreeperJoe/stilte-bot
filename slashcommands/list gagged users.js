const { SlashCommandBuilder } = require("@discordjs/builders")

const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');

const run = async (client, interaction) => {
    const gaglist = new Enmap({
        name: "gaglist",
        fetchAll: true, // Important, we fetch all of the entries when we run it, so this can get quite laggy in the future.
        autoFetch: true,
        cloneLevel: 'deep'
    })

    // Joe's terrible date management(TM)
    const d = new Date()
    const datesetup = new Date(d.valueOf());
    const currentDate = datesetup.toLocaleString()


    const gaggedUsers = gaglist.filter(user => user.guild === interaction.guild.id).array();
    const embed = new MessageEmbed()
        .setTitle("Gagged List")
        .setColor(0x00AE86);
    for (const data of gaggedUsers) {
        // Loops through each entry of list and adds a line in the embed for each one. 
        let key = `${data.guild}-${data.name}`
        let fetchExperitationDate = gaglist.get(key, "expirationdate")
        let expirationDate = fetchExperitationDate.toLocaleString()
        if (currentDate >= expirationDate) {
            // Drops them if they are outdated, so we never have outdated entries.
            gaglist.delete(key);
            break;
        }
        embed.addField(client.users.cache.get(data.name).tag, `until ${data.expirationdate}`, true);
    }
    return interaction.reply({ embeds: [embed], ephemeral: true })

}


module.exports = {
    data: new SlashCommandBuilder().setName("list-gagged-users").setDescription("Lists all the users that have been gagged."),
    name: "list-gagged-users",
    perms: "useperms",
    description: "Lists all the users that have been gagged.",
    run
}