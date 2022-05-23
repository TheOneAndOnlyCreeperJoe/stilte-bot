const { SlashCommandBuilder } = require("@discordjs/builders")
const Enmap = require('enmap');

// This solely exists as just a "hey does the bot work command", with a funny response incase he does.

module.exports = {
    data: new SlashCommandBuilder().setName("poke").setDescription("Test if the stupid bot works."),
    name: "poke",
    description: "Test if the stupid bot works",
    serverOnly: false,
    run(client, interaction){
        return interaction.reply({content: "Yes yes, I'm here. :crocodile:", ephemeral: true})
    }
}