const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const run = async (client, interaction) => {
    //because of issues staying up to date, we are getting the settings inside of the run
    const settings = new Enmap({
        name: "settings",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
    });

    //Get the important values to display; the key, permissions to use, permissions to manage and all the blacklists.
    const key = interaction.guild.id
    const permsUse = settings.get(interaction.guild.id, "permsUse")
    const permsManage = settings.get(interaction.guild.id, "permsManage")
    const blacklist = settings.get(interaction.guild.id, "blacklistedChannels")

    // have to go through each one of those to change their 1s and 0s into on and off to make it more friendly to the people that aren't that tech savvy.
    let toggleSafeword = settings.get(interaction.guild.id, "toggleSafeword")
    let toggleRP = settings.get(interaction.guild.id, "toggleRP")
    let toggleSelfUse = settings.get(interaction.guild.id, "toggleSelfUse")
    let toggleHierarchy = settings.get(interaction.guild.id, "toggleHierarchy")
    // This hurts my soul.
    if (toggleSafeword === 1) toggleSafeword = "On"
    else toggleSafeword = "Off"
    if (toggleRP === 1) toggleRP = "On"
    else toggleRP = "Off"
    if (toggleSelfUse === 1) toggleSelfUse = "On"
    else toggleSelfUse = "Off"
    if (toggleHierarchy === 1) toggleHierarchy = "On"
    else toggleHierarchy = "Off"

    const embed = new MessageEmbed()
        .setTitle("Settings")
        .addFields(
            { name: '**Server ID**', 
            value: `\`\`${key}\`\` \n This is the ID for your guild, which is used by the DB to store your settings. \n Only really useful for the developer to help with debugging.` },
            
            { name: '**Perms Use** *(/perms-use)*', 
            value: `\`\`${permsUse}\`\` \n This is the role permission required to use /gag and /ungag. \n Default is MODERATE_MEMBERS. ` },
            
            { name: '**Perms Manage** *(/perms-manage)*', 
            value: `\`\`${permsManage}\`\` \n This is the role permission to use bot management commands, such as /blacklist and /toggle. \n Default is MANAGE_GUILD. ` },
            
            { name: '**Toggle Safeword** *(/toggle-safeword)*', 
            value: `\`\`${toggleSafeword}\`\` \n Toggles the use of /safeword, a command that forcibly removes the gag from the user regardless of permissions, as well as /optout, which prevents one from being gagged. \n Default is on. \n *DISCLAIMER: Turning this function off may lead to sour situations and drama. You are the only one to blame when it occurs.* ` },
            
            { name: '**Toggle RP** *(/toggle-roleplay)*', 
            value: `\`\`${toggleRP}\`\` \n Toggles the use of roleplaying, which allows gagged users to bypass the filter by using the * and _ to surround (parts of) their messages. \n Default is off. \n *EXPERIMENTAL FEATURE: This feature's functionality is not consistent across all gags, consult /gaglist on RP mode's behavior.* ` },
            
            { name: '**Toggle Self Use** *(N/A)*', 
            value: `\`\`${toggleSelfUse}\`\` \n Toggles the ability for users to gag themselves, even if they cannot access /gag. Not implemented yet. \n Default is off. ` },
            
            { name: '**Toggle Hierarchy** *(/toggle-hierarchy)*', 
            value: `\`\`${toggleHierarchy}\`\` \n Toggles the hierarchy, preventing users from lower rank from gagging others with equal or higher ranks, and prevents removing their gags by them. \n Default is off. ` },
            
            { name: '**Blacklist** *(/blacklist-add & /blacklist-remove)*', 
            value: `\`\`${blacklist.join(", ")}\`\` \n The list of channels that are blacklisted, causing Stilte to not process user's messages in that channel.` }
        )
        .setColor(0x00AE86);
    return interaction.reply({ embeds: [embed], ephemeral: true })

}
module.exports = {
    data: new SlashCommandBuilder().setName("settings").setDescription("Lists all configured server settings."),
    name: "settings",
    description: "Lists all configured server settings.",
    perm: "manageperms",
    run
}