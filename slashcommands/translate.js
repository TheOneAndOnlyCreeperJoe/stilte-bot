const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require('discord.js');
const optout = require("./optout");
const gagLists = require("../gaglists");

const types = [
    { name: "Ball-gag", value: 0, plural: "ged" }, // Default
    { name: "Muzzle", value: 1, plural: "d" }, // 
    { name: "Ring-gag", value: 2, plural: "ged" }, // 
    { name: "Cock-gag", value: 3, plural: "ged" },
    { name: "Bit-gag", value: 4, plural: "ged" },
    { name: "Sound-Proof Hood", value: 5, plural: "ed" }, // Just straight up deletes all messages.
    { name: "Synth Gag", value: 6, plural: "ged" }, // Also known as the emoji gag.
]

const run = async (client, interaction) => {
    //Yes, this is a copypaste of mostly the entire gag code with minor alterations. This is a terrible practice, and at some point I should yoink the onmessagecreate out of the index and somewhere modular
    //For now, this works.
    
    //interaction.member = the user

    const text = interaction.options.getString("text")
    let gagType = interaction.options.getNumber("type") //gagspeak by default

    if (gagType == null) gagType = 0 // Because for some reason using || 0 seemed to override the gag-type constantly.
    try {
        // This is the part where we filter everything that needs to be filtered: external emojis and check if we are in RP mode.
        const RPmode = 1 // normally we get the rpmode manually, but in this case since its a translation module I think its fittin to always have it on.
        const emoteFilteredMessage = text.replace(/<a?:.+?:\d+>/g, ''); // filters external emojis due to it turning into a mumbled mess
        let asteriskFlag = false // this is the flag we'll use to check if we need to ignore parts of the message while in RP mode.
        let underscoreFlag = false // so Discord uses underscores for /me so we need to include this as well
        let gagSpeech = "";
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
            if (text.length !== 0 && RPmode === 1 ? (emoteFilteredMessage[0] === '_' && emoteFilteredMessage[emoteFilteredMessage.length - 1] === '_') : false) gagSpeech = text
            else if (text.length !== 0 && RPmode === 1 ? (emoteFilteredMessage[0] === '*' && emoteFilteredMessage[emoteFilteredMessage.length - 1] === '*') : false) gagSpeech = text
            else if (!text.match(emoteRegex)) { // Prevents crashing.
                gagSpeech = ":zipper_mouth: (Emoji gag only works if the message is entirely emojis or entirely a RP-mode message)"
            }
            else {
                // Get all unicode and discord emotes and make a new message string based on them.
                for (const match of text.match(emoteRegex)) {
                    const emoji = match;
                    gagSpeech += emoji
                }
            }
        }
        const embed = new MessageEmbed()
        .setColor(0x3364ff)
        embed.addField(types[gagType].name + " Translation", gagSpeech, true);
        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
    catch { }
}

module.exports = {
    data: new SlashCommandBuilder().setName("translate").setDescription("Translates a send message, as if it were gagged."),
    name: "translate",
    description: "Translates a send message, as if it were gagged.",
    serverOnly: false,
    options: [
        {
            name: "text",
            description: "What you want translated.",
            type: "STRING",
            required: true
        },
        {
            name: "type",
            description: "The type of gag to use for the translation.",
            type: "NUMBER",
            choices: types,
            required: true
        },
    ],
    run
}