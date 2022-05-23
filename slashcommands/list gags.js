const { SlashCommandBuilder } = require("@discordjs/builders")

const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName("list-gags").setDescription("Lists all the gags that you can use."),
    name: "list-gags",
    description: "Lists all the gags that you can use.",
    serverOnly: false,
    run(client, interaction){
        const embed = new MessageEmbed()
        .setTitle("Gag List")
        .addFields( 
            {name: '**Ball-Gag**', value: 'The default and stereotypical gag. Sounds just like the real ball-gag.'},
            {name: '**Ring-Gag**', value: 'A lighter and more understandable gag. Sounds just like the real ring-gag.'},
            {name: '**Muzzle**', value: 'A sturdier gag that\'s harder to understand. Sounds just like the real muzzle gag.'},
            {name: '**Cock-Gag**', value: 'A gag that makes everything sound a lot more exagerrated.  Sounds like having a real cock in your mouth.'},
            {name: '**Bit-Gag**', value: 'A very silly sounding gag. Sounds just like a real bit gag.' },
            {name: '**Sound-Proof Hood**', value: 'A gag that prevents any speech altogether, turning it into a simple "...". \n RP mode will only function with this gag if using the /me command or by starting and ending your message with _ or *'},
            {name: '**Synth Gag**', value: 'A gag that only allows speech through emojis or discord server emotes. \n RP mode will only function with this gag if using the /me command or by starting and ending your message with _ or *'},
        )
        .setColor(0x00AE86);
        return interaction.reply({embeds: [embed], ephemeral: true}) 
        
    }
    
}