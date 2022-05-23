/*
const Enmap = require('enmap');
const gags = new Enmap({
    name: "gags",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
})

const types = [
	{ name: "Override", value: 0 }, // Override replaces the message with another specified text. Configureable.
	{ name: "Obscure", value: 1 }, // Overrides specific letters and sylabyles with another, that makes it sounds like they're gagged. Not configureable.
	{ name: "Silence", value: 2 }, // Just straight up deletes all messages. Not configureable.
]

const run = async (client, interaction) => {
    let gagName = interaction.options.getString("name")
    let gagType = interaction.options.getNumber("type")
    

    try {
        if (interaction.guild) 
        {
            gags.ensure(interaction.guild.id, {
                name: gagName,
                type: gagType,})
            interaction.reply('Gag ' + gagName + ' succesfully created.')
        }
    } catch (error) {
        console.error('Error trying to send a message: ', error);
        return interaction.reply('Failed to create gag: ' + error + ', please yell at the developer.')
    }
    
}

module.exports = {
    name: "creategag",
    description: "Creates a new type of gag",
    perm: 'MANAGE_ROLES',
    options: [
        {
            name: "name", description: "The name to give the gag", type: "STRING", required: true
            
        },
        {
            name: "type",
            description: "The behavior of the gag. Read /help createGag for specifics.",
            type: "NUMBER",
            choices: types,
            required: true
        },
    ],
    run
}
*/