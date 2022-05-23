const { SlashCommandBuilder } = require("@discordjs/builders")

const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');

const run = async (client, interaction) => {
    const optoutList = new Enmap({
        name: "optoutList",
        fetchAll: true,
        autoFetch: true,
        cloneLevel: 'deep'
    })

    const optedoutUsers = optoutList.filter(user => user.guild === interaction.guild.id).array();
    const embed = new MessageEmbed()
        .setTitle("Opted Out Users")
        .setColor(0x00AE86);
    let optoutUser;
    for (const data of optedoutUsers) {
        // Loops through each entry of list and adds a line in the embed for each one.
        // Heroku seems to not like how I handled this previously, so lets try this safer and less
        try {
            optoutUser = await client.users.fetch(data.user)
            embed.addField(`${optoutUser.username}#${optoutUser.discriminator}`, '\u200B', true);
        }
        catch {
            break;
        }
    }
    return interaction.reply({ embeds: [embed], ephemeral: true }) // why can I not return an embed and not have the bot bitch that it didn't respond?

}

module.exports = {
    data: new SlashCommandBuilder().setName("list-optout-users").setDescription("Lists all the users that have opted out."),
    name: "list-optout-users",
    perms: "useperms",
    description: "Lists all the users that have opted out.",
    run
}