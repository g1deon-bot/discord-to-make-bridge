const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// On utilise des variables d'environnement pour la sécurité
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

client.on('messageCreate', async (message) => {
    // 1. On ignore les messages des bots (pour éviter les boucles infinies)
    if (message.author.bot) return;

    // 2. On vérifie si c'est un forum ou un message texte (optionnel : tu peux filtrer ici)
    console.log(`Nouveau message de ${message.author.username}: ${message.content}`);

    try {
        // 3. Envoi instantané vers Make
        await axios.post(MAKE_WEBHOOK_URL, {
            content: message.content,
            author: message.author.username,
            channelId: message.channelId,
            channelName: message.channel.name,
            timestamp: message.createdAt,
            messageId: message.id
        });
    } catch (error) {
        console.error("Erreur lors de l'envoi vers Make:", error.message);
    }
});

client.login(process.env.DISCORD_TOKEN);
