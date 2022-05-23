const { SlashCommandBuilder } = require("@discordjs/builders")

const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName("commands").setDescription("Lists all the general use commands."),
    name: "commands",
    description: "Lists all the general use commands.",
    serverOnly: false,
    run(client, interaction){
        const embed = new MessageEmbed()
        .setTitle("Help")
        .addFields( // I personally like the spacing between each question but feel free to omit it future person.
            {name: '**Gag** *(/gag)*', 
            value: 'Gags a member. Pick a target, pick a duration and optionally, specify any specific gag, defaulting to ball-gag if none are chosen. \n Gagging filters all messages send by the person into gag-speak, omitting some parts depending on if the toggle roleplay setting is on. \n*Requires \'use\' permissions.*'},
            
            {name: '**Help** *(/help)*', 
            value: 'Gives a quick list of questions and answers. If you\'re asking it, its probably on it.'},
            
            {name: '**List Blacklist** *(/list-blacklist)*', 
            value: 'Lists the channels that are blacklisted using the blacklist series of commands. \n Blacklisted channels are ignored by Stilte if he has access to that channel.'},
            
            {name: '**List Gagged Users** *(/list-gagged-users)*', 
            value: 'Lists all the users that are currently gagged in the server. \n*Requires \'use\' permissions.*'},
            
            {name: '**List Gags** *(/list-gags)*', 
            value: 'Lists all the gags that exist and their purpose.'},

            {name: '**List Optout Users** *(/list-optout-users)*', 
            value: 'Lists all the users that have used /optout, preventing them from being gagged. \n*Requires \'use\' permissions.*'},

            {name: '**Optout** *(/optout)*', 
            value: 'Stops others from gagging you. Use again to re-enable it. This setting may be disabled, depending on the server\'s settings.'},

            {name: '**Poke** *(/poke)*', 
            value: 'Pokes the bot and returns a funny message. Mostly used to check if the bot is offline or not.'},

            {name: '**Safeword** *(/safeword)*', 
            value: 'Removes any gags currently affecting you. This setting may be disabled, depending on the server\'s settings..'},

            {name: '**Settings** *(/settings)*', 
            value: 'Lists the server\'s configured settings, such as enabling roleplay mode. \n*Requires \'manage\' permissions.*'},

            {name: '**Ungag** *(/ungag)*', 
            value: 'Removes a gag from an user prematurely. \n*Requires \'use\' permissions.*.'},
        )
        .setColor(0x00AE86);
        return interaction.reply({embeds: [embed], ephemeral: true}) 
        
    }
    
}