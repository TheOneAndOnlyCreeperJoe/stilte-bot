const { SlashCommandBuilder } = require("@discordjs/builders")
const Enmap = require('enmap');
const settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
});

const falsetrue = [
    { name: "Disable", value: 0 }, // 
    { name: "Enable", value: 1 }, // Default
]

const run = async (client, interaction) => {
    // get the bool for the toggle, and the server key
    let toggle = interaction.options.getNumber("toggle")
    let key = `${interaction.guild.id}`;
    try {
        settings.set(key, toggle, "toggleRP");

    } catch (error) {
        console.error('Error trying to toggle roleplay mode: ', error);
        return interaction.reply('Error trying to toggle roleplay mode: ' + error + ', please yell at the developer because this is a serious issue.')
    }
    if (toggle === 1) interaction.reply(`Succesfully enabled roleplay mode`)
    else return interaction.reply(`Succesfully disabled roleplay mode.`)
}

module.exports = {
    data: new SlashCommandBuilder().setName("toggle-roleplay").setDescription("Enables or disables the use of /me or asterisks (*) to bypass parts of the gag filter."),
    name: "toggle-roleplay",
    description: "Enables or disables the use of /me or asterisks (*) to bypass parts of the gag filter.",
    perm: "manageperms",
    options: [
        {
            name: "toggle",
            description: "Enables or disables roleplay mode.",
            type: "NUMBER",
            choices: falsetrue,
            required: true
        },
    ],
    run
}
