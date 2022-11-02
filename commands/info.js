const {SlashCommandBuilder, EmbedBuilder, client} = require('discord.js');
const { execute } = require('./searchStock');


module.exports = {
    data: new SlashCommandBuilder()
            .setName('info')
            .setDescription('informations about the bot'),
    async execute(interaction, client){
        let commandList = '';
        
        Array.from(client.commands).forEach((command) => commandList = commandList + `\n  ${command[0]}:  ${command[1].data.description}`)

        const infoEmbed = new EmbedBuilder()
                .setAuthor({ name: client.user.username })
                .setColor(0xF28500)
                .addFields( {name:"General Info:", value:
                  ` Bot Id:  ${client.user.id}
                   Bot Tag:  ${client.user.tag}
                   Developer:  [fadi benzaima#5199](https:\/\/github.com\/fadibenz)`},
                  {name:"Bot Stats:", value:
                  `Servers: ${client.guilds.cache.size}
                   Channels:  ${client.channels.cache.size}`},
                  {name:"commands Info:", value: commandList},
                  {name:"System Info:", value:
                  ` RAM Usage:   ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
                   Node Version:  ${process.version}
                   Platform:  ${process.platform}`}
                )
                interaction.reply({ embeds: [infoEmbed] })
    }
}