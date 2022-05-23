const { SlashCommandBuilder } = require("@discordjs/builders")

const Enmap = require('enmap');
const settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
});

// Discord does not let us have a list larger than 25 for slash commands, so we comment out the ones that likely will never be used.
const permslist = [
    //{name: "CREATE_INSTANT_INVITE", value: "CREATE_INSTANT_INVITE"}, 
    {name: "KICK_MEMBERS", value: "KICK_MEMBERS"}, 
    {name: "BAN_MEMBERS", value: "BAN_MEMBERS"}, 
    {name: "ADMINISTRATOR", value: "ADMINISTRATOR"}, 
    {name: "MANAGE_CHANNELS", value: "MANAGE_CHANNELS"}, 
    {name: "MANAGE_GUILD", value: "MANAGE_GUILD"}, 
    //{name: "ADD_REACTIONS", value: "ADD_REACTIONS"}, 
    {name: "VIEW_AUDIT_LOG", value: "VIEW_AUDIT_LOG"}, 
    //{name: "PRIORITY_SPEAKER", value: "PRIORITY_SPEAKER"}, 
    //{name: "STREAM", value: "STREAM"}, 
    //{name: "VIEW_CHANNEL", value: "VIEW_CHANNEL"}, 
    {name: "SEND_MESSAGES", value: "SEND_MESSAGES"}, 
    {name: "SEND_TTS_MESSAGES", value: "SEND_TTS_MESSAGES"}, 
    {name: "MANAGE_MESSAGES", value: "MANAGE_MESSAGES"}, 
    {name: "EMBED_LINKS", value: "EMBED_LINKS"}, 
    {name: "ATTACH_FILES", value: "ATTACH_FILES"}, 
    {name: "READ_MESSAGE_HISTORY", value: "READ_MESSAGE_HISTORY"}, 
    {name: "MENTION_EVERYONE", value: "MENTION_EVERYONE"}, 
    //{name: "USE_EXTERNAL_EMOJIS", value: "USE_EXTERNAL_EMOJIS"}, 
    //{name: "VIEW_GUILD_INSIGHTS", value: "VIEW_GUILD_INSIGHTS"}, 
    //{name: "CONNECT", value: "CONNECT"}, 
    //{name: "SPEAK", value: "SPEAK"}, 
    //{name: "MUTE_MEMBERS", value: "MUTE_MEMBERS"}, 
    //{name: "DEAFEN_MEMBERS", value: "DEAFEN_MEMBERS"}, 
    //{name: "MOVE_MEMBERS", value: "MOVE_MEMBERS"}, 
    //{name: "USE_VAD", value: "USE_VAD"}, 
    {name: "CHANGE_NICKNAME", value: "CHANGE_NICKNAME"}, 
    {name: "MANAGE_NICKNAMES", value: "MANAGE_NICKNAMES"}, 
    {name: "MANAGE_ROLES", value: "MANAGE_ROLES"}, 
    {name: "MANAGE_EVENTS", value: "MANAGE_EVENTS"}, 
    {name: "MANAGE_THREADS", value: "MANAGE_THREADS"}, 
    //{name: "CREATE_PUBLIC_THREADS", value: "CREATE_PUBLIC_THREADS"}, 
    //{name: "CREATE_PRIVATE_THREADS", value: "CREATE_PRIVATE_THREADS"}, 
    //{name: "USE_EXTERNAL_STICKERS", value: "USE_EXTERNAL_STICKERS"}, 
    //{name: "SEND_MESSAGES_IN_THREADS", value: "SEND_MESSAGES_IN_THREADS"}, 
    {name: "USE_EMBEDDED_ACTIVITIES", value: "USE_EMBEDDED_ACTIVITIES"}, 
    {name: "MODERATE_MEMBERS", value: "MODERATE_MEMBERS"},
]


const run = async (client, interaction) => {
    // get the permissions to be used and server key
    let permissions = interaction.options.getString("permission")
    let key = `${interaction.guild.id}`;
    try {
        settings.set(key, permissions, "permsUse");
    } catch (error) {
        console.error('Error trying to edit permissions: ', error);
        return interaction.reply('Failed to edit permissions: ' + error + ', please yell at the developer because this is a serious issue.')
    }
    return interaction.reply(`Use permissions have succesfully been changed to ${permissions}`)
}

module.exports = {
    data: new SlashCommandBuilder().setName("perms-use").setDescription("Sets the permission to use the gag-bot, but not manage it"),
    name: "perms-use",
    description: "Sets the permission to use the gag-bot, but not manage it.",
    perm: "manageperms", //"MANAGE_GUILD" || "ADMINISTRATOR", //set to `${manageperm}`, later
    options: [
        {
            name: "permission",
            description: "The permission to give",
            type: "STRING",
            choices: permslist,
            required: true
        },
    ],
    run
}
