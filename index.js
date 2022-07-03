const { channel } = require("diagnostics_channel")
const Discord = require("discord.js")
const { MessageEmbed } = require('discord.js');
const gagLists = require("./gaglists")
const Enmap = require('enmap');

require("dotenv").config()

const DEVMODE = process.env.DEVMODE // SET TO 1 IN ENV WHEN YOU'RE WORKING LOCALLY, THIS DISABLES THE USEAGE OF COMMANDS AND THE TEXT REPLACEMENT OUTSIDE OF THE SERVER.
const DEVSERVER = process.env.DEVSERVER // SET THIS TO THE SERVER YOU WANT TO BE TESTING THE BOT
if (DEVMODE == 1) console.log("Warning: Devmode is on.")

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_WEBHOOKS"]
})
let bot = { client }

let settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
});

let gaglist = new Enmap({
    name: "gaglist",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
})

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
    if (DEVMODE == 1 && client.id != DEVSERVER) client.user.setActivity("MAINTENANCE MODE");
    else client.user.setActivity("with subs 🐊")
})

client.slashcommands = new Discord.Collection()
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadSlashCommands(bot, false)

// Whenever someone calls a slash command.
client.on("interactionCreate", (interaction) => {
    const embed = new MessageEmbed()
    try {
        //If its not actually a command or we're in DEVMODE: don't
        if (!interaction.isCommand()) return
        if (DEVMODE == 1 && interaction.guild.id != DEVSERVER) {
            embed.setColor(0xe68500)
            embed.addField('Error!', 'I am currently in maintenance mode, please try again later!', true);
            return interaction.reply({ embeds: [embed] })
        }

        const slashcmd = client.slashcommands.get(interaction.commandName) // Get all the loaded slash commands.

        // We allow for limited use of commands outside of servers. Thse are marked with serverOnly: false.
        if (!interaction.inGuild() && slashcmd.serverOnly !== false) return interaction.reply("I do not allow for this command outside of servers!")

        //so before we run any command in Stilte we make sure that the settings are actually there.
        if (interaction.inGuild()) {
            settings.ensure(`${interaction.guild.id}`, {
                blacklistedChannels: [],	//channels in which the bot will not replace messages.
                permsUse: "MODERATE_MEMBERS",	//the default permission to use existing gag commands, but not create or alter them.
                permsManage: "MANAGE_GUILD", // the default permission for debug commands a la /poke and managing who has access to what.
                toggleSafeword: 1, // checks if safeword is enabled, which is a forced ungag.
                toggleSelfUse: 0, // checks if users can gag themselves.
                toggleRP: 0, // checks if the bot should retain anything between asterisks, as is common with RP.
                toggleHierarchy: 0, // checks if role hierarchy is enforced, aka can't gag equal or higher role tier people, or undo their gags.
            })
        }

        let requiredperms = "ADMINISTRATOR" // default to admin cause why not
        let key
        if (interaction.inGuild()) key = `${interaction.guild.id}`

        if (!slashcmd) return interaction.reply("Invalid slash command. I am honestly quite impressed you managed to trigger this error, please tell the developer this so you can earn a cookie.") // How does this even happen?

        //so because we can't get the ID of the guild inside slashcommands (yes we can Past Joe you shit-tier programmer), we actually handle perms in here.
        //That said, this keeps perms nicely centralized.
        switch (slashcmd.perm) {
            case "useperms": requiredperms = settings.get(key, "permsUse"); break;
            case "manageperms": requiredperms = settings.get(key, "permsManage"); break;
        }

        //Naughty naughty, you're not allowed to do that~
        if (slashcmd.perm) {
            if (!interaction.member.permissions.has(requiredperms)) {
                embed.setColor(0xe6b800)
                embed.addField('No Permission!', 'You do not have the permissions to run this command!', true);
                return interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
        slashcmd.run(client, interaction) // RUUUUUUN
    }
    catch {
        console.error('Error trying to run command: ', error);
        embed.setColor(0xe61b00)
        embed.addField('Error!', 'Failed to run command! Please yell at the developer, as this is a serious issue. Error: ' + error, true);
        return interaction.reply({ embeds: [embed] })
    }

    //so before and after every command we run from Stilte we actually rebuild all the relevant enmaps. This way, they'll always be up to date without needing to refresh them every message.
    gaglist = new Enmap({
        name: "gaglist",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
    })
    settings = new Enmap({
        name: "settings",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
    })
})


let d = new Date();
console.log(d.toLocaleString());
client.login(process.env.TOKEN)

// Whenever a server is joined, create auto-ensured settings. 
client.on("guildCreate", guild => {
    console.log(`Guild joined: ${guild.name} - ${guild.id}`)
    const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has("SEND_MESSAGES"))
    channel.send("Thank you for inviting Stilte bot! If you are the one that added this bot, please make sure to run through /settings to make sure everything is to your liking. /commands will list all useable commands, and /help will answer commonly asked questions!")
    settings.ensure(`${guild.id}`, {
        blacklistedChannels: [],	//channels in which the bot will not replace messages.
        permsUse: "MODERATE_MEMBERS",	//the default permission to use existing gag commands, but not create or alter them.
        permsManage: "MANAGE_GUILD", // the default permission for debug commands a la /poke and managing who has access to what.
        toggleSafeword: 1, // checks if safeword is enabled, which is a forced ungag.
        toggleSelfUse: 0, // checks if users can gag themselves.
        toggleRP: 0, // checks if the bot should retain anything between asterisks, as is common with RP.
        toggleHierarchy: 0, // checks if role hierarchy is enforced, aka can't gag equal or higher role tier people, or undo their gags.
    })
});

// When the bot leaves or is kicked, delete settings to prevent stale entries.
client.on("guildDelete", guild => {
    console.log(`Guild left: ${guild.name} - ${guild.id}`)
    settings.delete(guild.id);
});

// The meat of the bot; where we filter messages if the person is gagged. 
client.on("messageCreate", async (message) => {
    if (message.inGuild() ? (DEVMODE == 1 && message.guild.id !== DEVSERVER) : true) return // This is solely so that I can run it in test without breaking other people's stuff.
    if (message.attachments.size > 0 && message.content.length === 0) return // solves a crashing issue

    const key = `${message.guild.id}-${message.author.id}`;
    // We check for 2 things; if its a bot and if the person's on the gaglist.
    if (!message.author.bot && gaglist.has(key)) {
        let blacklist = settings.get(message.guild.id, "blacklistedChannels")
        if (blacklist.indexOf(message.channel.name) == -1) { // Check if the channel is blacklisted.
            //cause I can't manage dates ayylmao, at least it checks if the person is gagged before it checks the date to keep the workload low.
            let datesetup = new Date();
            let currentDate = datesetup.toLocaleString()
            let fetchExperitationDate = gaglist.get(key, "expirationdate")
            let expirationDate = fetchExperitationDate.toLocaleString()
            const trueCurrentDate = new Date(`${currentDate}`).getTime()
            const trueExpirationDate = new Date(`${expirationDate}`).getTime()
            /* // Date-time testers below, uncomment at your leasure.
            console.log("CD: " + trueCurrentDate + " vs ED: " + trueExpirationDate)
            console.log("CD: " + currentDate + " vs ED: " + expirationDate )
            */

            //Drop the user from the gaglist if their time is up.
            if (trueCurrentDate >= trueExpirationDate) {
                gaglist.delete(key);
                return;
            }
            else {
                try {
                    // This is the part where we filter everything that needs to be filtered: external emojis and check if we are in RP mode.
                    const RPmode = settings.get(message.guild.id, "toggleRP") // this is where we check if we're in RP mode.
                    const emoteFilteredMessage = message.content.replace(/<a?:.+?:\d+>/g, ''); // filters external emojis due to it turning into a mumbled mess
                    d = new Date();
                    let asteriskFlag = false // this is the flag we'll use to check if we need to ignore parts of the message while in RP mode.
                    let underscoreFlag = false // so Discord uses underscores for /me so we need to include this as well
                    let gagSpeech = "";
                    let gagType = gaglist.get(key, "gagtype") //Find the gagtype associated with the user.
                    // So at this point we send back the webhook message, that mimmicks the username and avatar of the person, with funny gagged noises.
                    // Gagspeak gag-type; replace letters and numbers with characters from the ballGagTable
                    if (gagType <= 4) {
                        var noiseTable = []; // The table containing the gag, see gaglists.js
                        switch (gagType) {
                            case 0: noiseTable = gagLists.ballGagTable; break;
                            case 1: noiseTable = gagLists.muzzleTable; break;
                            case 2: noiseTable = gagLists.ringGagTable; break;
                            case 3: noiseTable = gagLists.cockGagTable; break;
                            case 4: noiseTable = gagLists.bitGagTable; break;

                        }
                        const gagNoise = ["m", "n", "ph", "mm", "h"]; // The noises used if its an irregular character, aka unicode/wèìrd chàràctèrs
                        for (let i = 0; i < emoteFilteredMessage.length;) {
                            if (RPmode === 1) {
                                // Toggles flags for RPmode whenever a * or _ pops up.    
                                if (i != 0 ? (emoteFilteredMessage[i] === '*' && emoteFilteredMessage[i - 1] !== '*') : emoteFilteredMessage[i] === '*') asteriskFlag = !asteriskFlag
                                if (i != 0 ? (emoteFilteredMessage[i] === '_' && emoteFilteredMessage[i - 1] !== '_') : emoteFilteredMessage[i] === '_') underscoreFlag = !underscoreFlag
                            }
                            // RP mode is on and a flag is checked, or the current character matches one that would check a flag, so we don't apply gag-filters.
                            if (RPmode === 1 ? (asteriskFlag === true || underscoreFlag === true || emoteFilteredMessage[i] === '*' || emoteFilteredMessage[i] === '_') : false) gagSpeech += emoteFilteredMessage[i]
                            else {
                                //No RPmode or the message is not between * and _, proceed to gag like normal.
                                let inputCharacter = emoteFilteredMessage[i].toLowerCase()
                                let result
                                let canHaveOpeners = false
                                let canHaveClosers = false
                                let openerNeeded = false
                                let closerNeeded = false
                                //Check if we can and/or need to put an opener or closer in front of the character.
                                if (`${inputCharacter}` in noiseTable) {
                                    if ('opener' in noiseTable[inputCharacter]) canHaveOpeners = true
                                    if (i !== 0 ? (emoteFilteredMessage[i - 1].toLowerCase() != inputCharacter) : true) openerNeeded = true
                                    //Check if we can and/or need to put a closer after the character.
                                    if ('closer' in noiseTable[inputCharacter]) canHaveClosers = true
                                    if (i !== emoteFilteredMessage.length - 1 ? (emoteFilteredMessage[i + 1].toLowerCase() != inputCharacter) : true) closerNeeded = true
                                    // Bit messy but argueably the best way to use two flags without concat?

                                    if (canHaveOpeners && canHaveClosers ? (openerNeeded && closerNeeded) : false) {
                                        result = noiseTable[inputCharacter].opener + noiseTable[inputCharacter].standard + noiseTable[inputCharacter].closer
                                    }
                                    else if (canHaveOpeners && openerNeeded) {
                                        result = noiseTable[inputCharacter].opener + noiseTable[inputCharacter].standard
                                    }
                                    else if (canHaveClosers && closerNeeded) {
                                        result = noiseTable[inputCharacter].standard + noiseTable[inputCharacter].closer
                                    }
                                    else {
                                        result = noiseTable[inputCharacter].standard
                                    }
                                }
                                if (result === undefined) {
                                    let randomGag = Math.floor(Math.random() * gagNoise.length);
                                    result = gagNoise[randomGag] // if we get undefined we just grab a random letter
                                }
                                gagSpeech += result
                            }
                            i++
                        }
                        //So at this point we checked if the message, if RPmode is on, is properly closed with asterisks and underscores, and if not, we re-run the gag script on it.
                        if (RPmode === 1 ? (asteriskFlag == true || underscoreFlag == true) : false) {
                            let lastOccurance = 0
                            // So the way we check how a message was improperly closed is the flags; they should be false if they are closed normally.
                            if (asteriskFlag == true && underscoreFlag == true) lastOccurance = Math.min(gagSpeech.lastIndexOf('*'), gagSpeech.lastIndexOf('_'))
                            else if (asteriskFlag == true) lastOccurance = gagSpeech.lastIndexOf('*')
                            else if (underscoreFlag == true) lastOccurance = gagSpeech.lastIndexOf('_')

                            const toBeReplacedText = gagSpeech.substring(lastOccurance + 1) // we do +1 so that we don't include the rogue smyobl.
                            gagSpeech = gagSpeech.slice(0, lastOccurance) // Cut away everything after the rogue symbol, because we're running through it again.
                            for (let i = 0; i < toBeReplacedText.length;) { // We don't need to check for RPmode since we're doing this because of a RPmode failure anyways.
                                //No RPmode or the message is not between * and _, proceed to gag like normal.
                                let inputCharacter = emoteFilteredMessage[i].toLowerCase()
                                let result
                                let canHaveOpeners = false
                                let canHaveClosers = false
                                let openerNeeded = false
                                let closerNeeded = false
                                //Check if we can and/or need to put an opener or closer in front of the character.
                                if (`${inputCharacter}` in noiseTable) {
                                    if ('opener' in noiseTable[inputCharacter]) canHaveOpeners = true
                                    if (i !== 0 ? (emoteFilteredMessage[i - 1].toLowerCase() != inputCharacter) : true) openerNeeded = true
                                    //Check if we can and/or need to put a closer after the character.
                                    if ('closer' in noiseTable[inputCharacter]) canHaveClosers = true
                                    if (i !== emoteFilteredMessage.length - 1 ? (emoteFilteredMessage[i + 1].toLowerCase() != inputCharacter) : true) closerNeeded = true
                                    // Bit messy but argueably the best way to use two flags without concat?
                                    if (canHaveOpeners && canHaveClosers ? (openerNeeded && closerNeeded) : false) result = noiseTable[inputCharacter].opener + noiseTable[inputCharacter].standard + noiseTable[inputCharacter].closer
                                    else if (canHaveOpeners && openerNeeded) result = noiseTable[inputCharacter].opener + noiseTable[inputCharacter].standard
                                    else if (canHaveClosers && closerNeeded) result = noiseTable[inputCharacter].standard + noiseTable[inputCharacter].closer
                                    else result = noiseTable[inputCharacter].standard

                                }
                                if (result === undefined) {
                                    let randomGag = Math.floor(Math.random() * gagNoise.length);
                                    result = gagNoise[randomGag] // if we get undefined we just grab a random letter
                                }
                                gagSpeech += result
                                i++
                            }
                        }
                        // Final steps
                        if (emoteFilteredMessage.length === 0 || !emoteFilteredMessage.replace(/\s/g, '').length) gagSpeech = "..." // The bot will have an aneurism if we try to send an empty message. This happens if their message was just external emojis, or an attachement.
                        else gagSpeech = gagSpeech[0].toUpperCase() + gagSpeech.substring(1) // Properly capitalize the first letter because we love being civilized.
                    }
                    else if (gagType == 5) { // We don't need to do anything fancy with the hood, since its just pure enforced silence.
                        // If RP mode is on, we check if the message begins and ends with either _ and *, and not a mix of either.
                        if (emoteFilteredMessage.length !== 0 && RPmode === 1 ? (emoteFilteredMessage[0] === '_' && emoteFilteredMessage[emoteFilteredMessage.length - 1] === '_') : false) gagSpeech = emoteFilteredMessage
                        else if (emoteFilteredMessage.length !== 0 && RPmode === 1 ? (emoteFilteredMessage[0] === '*' && emoteFilteredMessage[emoteFilteredMessage.length - 1] === '*') : false) gagSpeech = emoteFilteredMessage
                        else gagSpeech = "..."
                    }
                    else if (gagType == 6) { // the dreaded emoji gag.
                        const emoteRegex = /(<a?:.+?:\d+>|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g // This is the regex for all emojis.
                        // If RP mode is on, we check if the message begins and ends with either _ and *, and not a mix of either.
                        if (message.content.length !== 0 && RPmode === 1 ? (emoteFilteredMessage[0] === '_' && emoteFilteredMessage[emoteFilteredMessage.length - 1] === '_') : false) gagSpeech = message.content
                        else if (message.content.length !== 0 && RPmode === 1 ? (emoteFilteredMessage[0] === '*' && emoteFilteredMessage[emoteFilteredMessage.length - 1] === '*') : false) gagSpeech = message.content
                        else if (!message.content.match(emoteRegex)) { // Prevents crashing.
                            gagSpeech = ":zipper_mouth:"
                            message.author.send("You did not send any emojis/emotes with your text. Synth gag only allows for communication with emotes/emojis.")
                        }
                        else {
                            // Get all unicode and discord emotes and make a new message string based on them.
                            for (const match of message.content.match(emoteRegex)) {
                                const emoji = match;
                                gagSpeech += emoji
                            }
                        }
                    }
                    //WEBHOOK HANDLING
                    //Check if the webhook's already there
                    const channel = client.channels.cache.get(message.channel.id);
                    try {
                        const webhooks = await channel.fetchWebhooks();
                        let webhook = webhooks.find(wh => wh.name === `${client.user.username}`); // For the sake of making sure that the dev-bot can use his own webhooks.
                        if (!webhook) { // If Stilte is there.
                            message.channel.createWebhook(`${client.user.username}`).then(message.delete()).then(webhook => {
                                webhook.send({ content: gagSpeech, username: `${message.member.displayName}`, avatarURL: message.member.displayAvatarURL() })
                                //INCASE I WANT TO RESTORE EMBEDS, UNCOMMENT.
                                //if (message.attachments.size > 0) webhook.send({ content: gagSpeech, username: `${message.member.displayName}`, avatarURL: message.member.displayAvatarURL(), files: [message.attachments.first()] })
                                //else webhook.send({ content: gagSpeech, username: `${message.member.displayName}`, avatarURL: message.member.displayAvatarURL() })

                            })
                        }
                        else { // we found stilte pog
                            message.delete()
                            webhook.send({ content: gagSpeech, username: `${message.member.displayName}`, avatarURL: message.member.displayAvatarURL() })
                            //INCASE I WANT TO RESTORE EMBEDS, UNCOMMENT.
                            //if (message.attachments.size > 0) webhook.send({ content: gagSpeech, username: `${message.member.displayName}`, avatarURL: message.member.displayAvatarURL(), files: [message.attachments.first(), message.attachments.second(), message.attachments.third()] })
                            //else webhook.send({ content: gagSpeech, username: `${message.member.displayName}`, avatarURL: message.member.displayAvatarURL() })
                        }
                    } catch (error) {
                        console.error(`Error trying to send a message in ${message.guild.name} - ${message.guild.id}`, error);
                    }
                } catch (error) {
                    console.error(`Error trying to send a message in ${message.guild.name} - ${message.guild.id}`, error);
                }
            }
        }
    }
})

