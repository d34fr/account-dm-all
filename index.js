const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');

let config;
try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (err) {
  console.error("Erreur : impossible de lire le fichier config.json");
  process.exit(1);
}

const token = config.token;
const dmMessage = config.dmMessage;

const red = "\x1b[31m";
const green = "\x1b[32m";
const reset = "\x1b[0m";

const client = new Client();

const asciiD34FR = `
  _____   _____  _  _    ______  _____     
 |  __ \\ |___ / | || |  |  ____||  __ \\    
 | |  | |  |_ \\ | || |_ | |__   | |__) |   
 | |  | | ___) ||__   _||  __|  |  _  /    
 | |__| ||____/    | |  | |     | | \\ \\    
 |_____/           |_|  |_|     |_|  \\_\\   
`;

client.on('ready', async () => {
  console.log(`${green}[✅] Connecté en tant que ${client.user.tag}${reset}\n`);
  console.log(green + asciiD34FR + reset);

  const usersToDM = [...client.users.cache.values()].filter(user => !user.bot && user.id !== client.user.id);
  const totalUsers = usersToDM.length;
  console.log(`Nombre de membres à DM : ${totalUsers}`);

  let successCount = 0;
  let failCount = 0;

  console.log("Envoi des DMs…");

  for (const user of usersToDM) {
    const personalizedMessage = dmMessage.replace(/{user}/g, `<@${user.id}>`);
    
    try {
      await user.send(personalizedMessage);
      console.log(`${green}[✅] DM envoyé à ${user.username}${reset}`);
      successCount++;
    } catch {
      console.log(`${red}[❌] Impossible d’envoyer à ${user.username}${reset}`);
      failCount++;
    }
  }

  console.log(`${green}✅ Succès : ${successCount}${reset}`);
  console.log(`${red}❌ Échecs : ${failCount}${reset}`);
  console.log(`Total : ${totalUsers}`);

  console.log(`${green}Déconnexion…${reset}`);
  await client.destroy();   
  process.exit(0);         
});

client.login(token).catch(err => {
  console.error(`${red}[❌] Impossible de se connecter. Vérifie ton token.${reset}`);
  console.error(err);
});
