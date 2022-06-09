const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const optout = require("./optout");
const gaglist = new Enmap({
    name: "gaglist",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
})

const types = [
    { name: "Ball-gag", value: 0, plural: "ged" }, // Default
    { name: "Muzzle", value: 1, plural: "d" }, // 
    { name: "Ring-gag", value: 2, plural: "ged" }, // 
    { name: "Cock-gag", value: 3, plural: "ged" },
    { name: "Bit-gag", value: 4, plural: "ged"},
    { name: "Sound-Proof Hood", value: 5, plural: "ed" }, // Just straight up deletes all messages.
    { name: "Synth Gag", value: 6, plural: "ged" }, // Also known as the emoji gag.
]

const durations = [
    { name: "1 minute", value: 60 * 1000 },
    { name: "5 minutes", value: 5 * 60 * 1000 },
    { name: "10 minutes", value: 10 * 60 * 1000 },
    { name: "30 minutes", value: 30 * 60 * 1000 },
    { name: "1 hour", value: 60 * 60 * 1000 },
    { name: "6 hours", value: 6 * 60 * 60 * 1000 },
    { name: "12 hours", value: 12 * 60 * 60 * 1000 },
    { name: "1 day", value: 24 * 60 * 60 * 1000 },
    { name: "1 week", value: 7 * 24 * 60 * 60 * 1000 },
    // lets not? { name: "Indefinite", value: 99 * 365 * 24 * 60 * 60 * 1000}, // actually 99 years
]

const run = async (client, interaction) => {
    // We get these two enmaps within the async because we need to keep them up to date.
    const optoutList = new Enmap({
        name: "optoutList",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep'
    })
    const settings = new Enmap({
        name: "settings",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
    });

    const hierarchy = settings.get(interaction.guild.id, "toggleHierarchy") // checks if hierarchy is active and if we need to keep check of it.
    const member = interaction.options.getMember("user")
    const duration = interaction.options.getNumber("duration")
    let gagType = interaction.options.getNumber("type") //gagspeak by default
    let key = `${interaction.guild.id}-${member.id}`
    // Joe's piss poor data management below.
    const d = new Date()
    const date = d.toLocaleString()
    const msDuration = new Date(d.valueOf() + duration);
    const expiresOn = msDuration.toLocaleString()
    const tdate = Math.floor(msDuration / 1000)
    
    if (gagType == null) gagType = 0 // Because for some reason using || 0 seemed to override the gag-type constantly.
    // Prevents invalid member targeting, prevents hierarchy violations if activate, prevents opted out users from being targeted, and prevents DM commands.
    if (!member) return interaction.reply("Invalid member")
    if (interaction.member.id !== member.id && hierarchy === 1 ? (interaction.member.roles.highest.rawPosition <= member.roles.highest.rawPosition) : false) return interaction.reply({content: "They are of an equal or higher role than you! You cannot gag them.", ephemeral: true})
    if (optoutList.has(key) && settings.get(interaction.guild.id, "toggleSafeword") !== 0) return interaction.reply({content: "They are opted out of gagging!", ephemeral: true})
    if (!interaction.guild) return interaction.reply({ content: "This command can only be used in a server!", ephemeral: true })

    //console.log('Member: ' + member.id)
    //console.log('expirationDate: ' + expiresOn)
    //console.log('applicationDate: ' + date)
    //console.log('gagType: ' + gagType)
    try {
        if (interaction.guild) {
            if(member.id === client.user.id) // Fun easter egg if you try to gag the bot.
            {
                // So here we pull out the uno reverse card.
                key = `${interaction.guild.id}-${interaction.member.id}`
                gaglist.set(key, interaction.member.id, "name");
                gaglist.set(key, interaction.guild.id, "guild");
                gaglist.set(key, expiresOn, "expirationdate");
                gaglist.set(key, date, "applicationdate");
                gaglist.set(key, gagType, "gagtype");
                gaglist.set(key, -1, "applierRolePower");

                const embed = new MessageEmbed()
                .setColor(0xe60069)
                .addField('Uno Reverse Card' + '!', `${interaction.member.user} succesfully gagged <t:${tdate}> (expires <t:${tdate}:R>) with a ${types[gagType].name.toLowerCase()}, because they gagging the bot.`, true);
                return interaction.reply({embeds: [embed]})
            }
            else{
            // Set all the info for the gag DB.
            gaglist.set(key, member.id, "name");
            gaglist.set(key, interaction.guild.id, "guild");
            gaglist.set(key, expiresOn, "expirationdate");
            gaglist.set(key, date, "applicationdate");
            gaglist.set(key, gagType, "gagtype");
            
            if (interaction.member.id !== member.id && hierarchy === 1) gaglist.set(key, interaction.member.roles.highest.rawPosition, "applierRolePower"); //Used to keep track of the power of the gag applier if Hierarchy is on.
            else gaglist.set(key, -1, "applierRolePower"); // In case if role hierarchy is off, or if they self-gag, they can still ungag themselves.
            
            //Establish embed response.
            const embed = new MessageEmbed()
            .setColor(0xfc8803)
            .addField(types[gagType].name + types[gagType].plural + '!', `${member.user} succesfully gagged until <t:${tdate}> (expires <t:${tdate}:R>) with a ${types[gagType].name.toLowerCase()}`, true);
            return interaction.reply({embeds: [embed]})
            }
        }
    } catch (error) {
        console.error('Error trying to send a message: ', error);
        return interaction.reply('Failed to create gag: ' + error + ', please yell at the developer.')
    }
}

module.exports = {
    data: new SlashCommandBuilder().setName("gag").setDescription("Gags a member."),
    name: "gag",
    description: "Gags a member",
    perm: "useperms",
    options: [
        {
            name: "user",
            description: "The user to gag",
            type: "USER",
            required: true
        },
        {
            name: "duration",
            description: "The duration of the gag",
            type: "NUMBER",
            choices: durations,
            required: true
        },
        {
            name: "type",
            description: "The type of gag to apply.",
            type: "NUMBER",
            choices: types,
            required: false
        },
    ],
    run
}