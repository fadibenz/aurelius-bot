const { Client, GatewayIntentBits, Collection, Events } = require('discord.js')
const { token } = require('./config.json');
const fs = require("node:fs")
const path = require("node:path");
const { resolve } = require('node:path');

const client = new Client({ intents:[
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(token)

client.commands = new Collection()

const commandPath = path.join(__dirname,"commands")
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"))

for (const file of commandFiles){
  console.log(file)
  const filePath = path.join(commandPath,file);
  const command = require(filePath);
  if ("data" in command && "execute" in command){
    client.commands.set(command.data.name,command)
  }
  else{
    console.log("WARNING there's an error")
  }
}

client.on(Events.InteractionCreate ,async (interaction) =>{
  if(!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName)

  if(!command){
    console.log("command doesn't exist")
    return
  }
  
  try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

