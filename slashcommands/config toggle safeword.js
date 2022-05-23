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
        settings.set(key, toggle, "toggleSafeword");

    } catch (error) {
        console.error('Error trying to toggle the safeword: ', error);
        return interaction.reply('Error trying to toggle the safeword: ' + error + ', please yell at the developer because this is a serious issue.')
    }
    if (toggle === 1) interaction.reply(`Succesfully enabled the safeword`)
    else return interaction.reply(`Succesfully disabled the safeword.`)
}

module.exports = {
    data: new SlashCommandBuilder().setName("toggle-safeword").setDescription("Enables or disables the use of /safeword & /optout."),
    name: "toggle-safeword",
    description: "Enables or disables the use of /safeword & /optout.",
    perm: "manageperms",
    options: [
        {
            name: "toggle",
            description: "Enables or disables the use of /safeword",
            type: "NUMBER",
            choices: falsetrue,
            required: true
        },
    ],
    run
}
