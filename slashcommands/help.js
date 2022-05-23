const { SlashCommandBuilder } = require("@discordjs/builders")

const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Something's wrong, what's going on?"),
    name: "help",
    description: "Something's wrong, what's going on?",
    serverOnly: false,
    run(client, interaction){
        const embed = new MessageEmbed()
        .setTitle("Help")
        .addFields( // I personally like the spacing between each question but feel free to omit it future person.
            {name: '**Q: I don\'t want to be gagged!**', 
            value: '**A:** /safeword will ungag you, /optout will prevent you from being gagged again. Your server administrators may turn off safeword, in which case it is on them to deal with the problem.'},
            
            {name: '**Q: What are the commands?**', 
            value: '**A:** /commands gives you all the command that are intended for general use. /settings lists all the settings that can be changed with commands. Putting a / infront of your message also prompts discord to give you a list of command options.'},
            
            {name: '**Q: What do each of the type of gags do?**', 
            value: '**A:** Use the /list-gags command.'},
            
            {name: '**Q: How do I use the /perms commands? What does it all mean?**', 
            value: '**A:** https://discord.com/developers/docs/topics/permissions. This is a full list of all permissions. Type the one that you want to be able to use the command, and voila. Administrators can always use commands.'},
            
            {name: '**Q: The bot does not respond with gagged noises!**', 
            value: '**A:** If the bot is failing to send gagged responses, but the message still gets deleted, the Discord API may be temporarily rejecting webhooks. I do not know the casuse for this, but it should not intervere with any other functions besides the gagged responses. Best way to diagnose this problem is to right click the channel name on top of discord, click edit channel, click integrations and then webhooks. If it does not let you make a webhook, then that is the  problem. Channels also have a limit of 10 webhooks, so it may be clogged for some reason.'},
            
            {name: '**Q: Shit is broke!**', 
            value: '**A:** Bugs and issues are prone to happen. For inquiries, go to this discord (https://discord.gg/K7M9W9zNRw) and yell at me to fix your problems. If the link\'s expired, check the bot\'s bio for an up to date one.'},
        )
        .setColor(0x00AE86);
        return interaction.reply({embeds: [embed], ephemeral: true}) 
        
    }
    
}