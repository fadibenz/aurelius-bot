const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { renderChange, convertToInternationalCurrencySystem } = require('../modules/util')
const { api_key } = require("../config.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription("Realtime stock quote given the ticker symbol.")
        .addStringOption(option =>
			option
				.setName('stock')
				.setDescription('The stock to search')
                .setRequired(true)),    
    async execute(interaction){
            const stock = interaction.options.getString('stock')
            try{
                const res = await axios({
                    url:`https://cloud.iexapis.com/stable/stock/${stock}/quote?token=${api_key}`,
                    method: 'GET'
                })
                const stockEmbed = new EmbedBuilder()
                stockEmbed
                        .setTitle(`${res.data.companyName} (${res.data.symbol})`)
                        .setAuthor({ name: 'IEX cloud', iconURL: 'https://miro.medium.com/max/600/0*oSQC-_PkXNZ-0mfI.png', url: 'https://discord.js.org'})
                        .addFields(
                            { name: 'price', value: `${res.data.latestPrice } USD`},
                            // { name: '\u200B', value: '\u200B' },
                            { name: 'change', value: renderChange(res.data.change,stockEmbed,true), inline: true} ,
                            { name: 'primary exchange', value: `${res.data.primaryExchange}`, inline: true},
                            { name: 'Market cap', value: `${convertToInternationalCurrencySystem(res.data.marketCap)} USD`, inline: true}
                        );
                
                interaction.reply({ embeds: [stockEmbed] });
            }
            catch (err){
                console.log(err)
                interaction.reply("must provide valid Symbol");
            }
    }
}