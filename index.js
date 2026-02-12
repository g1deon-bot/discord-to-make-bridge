const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const http = require('http');

// 1. SERVEUR HTTP POUR RENDER (Évite l'erreur de Port Scan)
const PORT = process.env.PORT || 8080; 

http.createServer((req, res) => {
    res.write("I am alive and watching Discord!");
    res.end();
}).listen(PORT, () => {
    console.log(`Le serveur est pret sur le port ${PORT}`);
});

// 2. CONFIGURATION DU BOT DISCORD
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Récupération de l'URL Make depuis les variables d'environnement
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

client.on('messageCreate', async (message) => {
    // On ignore les messages des bots
    if (message.author.bot) return;

    // Log pour voir ce qui se passe dans la console Render
    console.log(`Message reçu de ${message.author.username}: ${message.content}`);

    try {
        // Envoi des données vers Make
        await axios.post(MAKE_WEBHOOK_URL, {
            content: message.content,
            author: message.author.username,
            channelId: message.channelId,
            channelName: message.channel.name,
            timestamp: message.createdAt,
            messageId: message.id
        });
        console.log("Données envoyées avec succès à Make !");
    } catch (error) {
        console.error("Erreur lors de l'envoi vers Make:", error.message);
    }
});

// Connexion du bot avec le Token
client.login(process.env.DISCORD_TOKEN);
