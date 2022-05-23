const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');

const types = [
    { name: "Ball-gag", value: 0, plural: "ged" }, // Default
    { name: "Muzzle", value: 1, plural: "d" }, // 
    { name: "Ring-gag", value: 2, plural: "ged" }, // 
    { name: "Cock-gag", value: 3, plural: "ged"},
    { name: "Bit-gag", value: 4, plural: "ged"},
    { name: "Sound-Proof Hood", value: 100, plural: "ed" }, // Just straight up deletes all messages.
    { name: "Synth Gag", value: 101, plural: "ged" }, // Also known as the emoji gag.
]

const run = async (client, interaction) => {
    //Settings and gaglist needs to be up to date so we get it inside of the run.
    const settings = new Enmap({
        name: "settings",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
    });
    const gaglist = new Enmap({
        name: "gaglist",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep'
    })

    const hierarchy = settings.get(interaction.guild.id, "toggleHierarchy") // checks if the hierarchy command is on
    let member = interaction.options.getMember("user")
    const key = `${interaction.guild.id}-${member.id}`;
    const embed = new MessageEmbed()

    try {
        // If the user is not on the list.
        if (!gaglist.has(key)) return interaction.reply({ content: `That user is currently not gagged!`, ephemeral: true })
        // If hierarchy is on, we check if the gagger's top role is equal to or higher than the ungagger. If it is, we prevent them from ungagging.
        if (hierarchy === 1 && gaglist.get(key, "applierRolePower") >= interaction.member.roles.highest.rawPosition) return interaction.reply({ content: `This gag was applied by someone with the ${interaction.guild.roles.find(element => element === gaglist.get(key, "applierRolePower"))} `, ephemeral: true })
        // If hierarchy isn't on this always happens.
        else {
            const gagType = gaglist.get(key, "gagtype")
            embed.setColor(0x9af76f)
            embed.addField('Ungagged!', `${member.user} has been freed from their ${types[gagType].name.toLowerCase()}!`, true);
            gaglist.delete(key);
            return interaction.reply({ embeds: [embed] })
        }
    } catch (error) {
        console.error('Error trying to ungag: ', error);
        embed.setColor(0xe61b00)
        embed.addField('Error!', 'Failed to ungag' + member.user + '. Error:' + error + ', please yell at the developer, as this is a serious issue.', true);
        return interaction.reply({ embeds: [embed] })
    }

}

module.exports = {
    data: new SlashCommandBuilder().setName("ungag").setDescription("Ungags a member."),
    name: "ungag",
    description: "Ungags a member",
    perm: "useperms",
    options: [
        {
            name: "user",
            description: "The user to ungag",
            type: "USER",
            required: true
        },
    ],
    run
}