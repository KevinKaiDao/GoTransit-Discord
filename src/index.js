require('dotenv').config();

const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

client.on(Events.ClientReady, (c) => {
    console.log(`Logged in as: ${c.user.tag}`);
})

client.login(process.env.DISCORD_TOKEN);