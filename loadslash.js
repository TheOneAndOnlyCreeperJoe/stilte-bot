const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const client = new Discord.Client({
    intents: [
        "GUILDS"
    ]
})

const CLIENT_ID = "950711851841376276"
const GUILD_ID = "429598630429851651"

client.slashcommands = new Discord.Collection()

let commands = []

const slashFiles = fs.readdirSync("./slashcommands").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slashcommands/${file}`)
    //console.log(slashcmd)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    commands.push(slashcmd.data.toJSON())
}

    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })