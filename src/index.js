require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection } = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

client.commands = getCommands(path.join(__dirname, 'commands'))

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as: ${c.user.tag}`);
})

client.on(Events.InteractionCreate, (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    let command = client.commands.get(interaction.commandName);

    try{
        if(interaction.replied) return;
        command.execute(interaction);
    } catch (error) {
        console.error(error);
    }
})

client.login(process.env.DISCORD_TOKEN);

function getCommands(dir) {
    let commands = new Collection();
    const commandFiles = getFiles(dir);

    for(const commandFile of commandFiles)  {
        let command = require(commandFile)
        commands.set(command.data.toJSON().name, command)
    }
    return commands;
}

function getFiles(dir){
    const files = fs.readdirSync(dir, {
        withFileTypes: true,
    });
    let commandFiles = [];

    for(const file of files) {
        if(file.isDirectory()){
            commandFiles = [
                ...commandFiles,
                ...getFiles(`${dir}/${file.name}`),
            ]
        } else if (file.name.endsWith(".js")) {
            commandFiles.push(`${dir}/${file.name}`)
        }
    }

    return commandFiles;
}