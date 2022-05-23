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
        settings.set(key, toggle, "toggleHierarchy");

    } catch (error) {
        console.error('Error trying to toggle the hierarchy: ', error);
        return interaction.reply('Error trying to toggle the hierarchy: ' + error + ', please yell at the developer because this is a serious issue.')
    }
    if (toggle === 1) interaction.reply(`Successfully enabled the hierarchy`)
    else return interaction.reply(`Successfully disabled the hierarchy.`)
}

module.exports = {
    data: new SlashCommandBuilder().setName("toggle-hierarchy").setDescription("Prevents or enables users from targeting people with a rank equal to or above theirs with gags."),
    name: "toggle-hierarchy",
    description: "Prevents or enables users from targeting people with a rank equal to or above theirs with gags.",
    perm: "manageperms",
    options: [
        {
            name: "toggle",
            description: "Enables or disables the hierarchy",
            type: "NUMBER",
            choices: falsetrue,
            required: true
        },
    ],
    run
}
