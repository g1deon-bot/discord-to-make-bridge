const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const http = require('http');

// 1. PETIT SERVEUR POUR RÉPONDRE À CRON-JOB
// Cela permet à Render de voir que ton bot est "actif" sur le web
http.createServer((req, res) => {
    res.write("I am alive and watching Discord!");
    res.end();
}).listen(8080); 

// 2. CONFIGURATION DU BOT DISCORD
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    console.log(`Nouveau message de ${message.author.username}: ${message.content}`);

    try {
        await axios.post(MAKE_WEBHOOK_URL, {
            content: message.content,
            author: message.author.username,
            channelName: message.channel.name,
            timestamp: message.createdAt
        });
    } catch (error) {
        console.error("Erreur Make:", error.message);
    }
});

client.login(process.env.DISCORD_TOKEN);
