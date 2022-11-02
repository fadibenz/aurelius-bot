const {SlashCommandBuilder, Options, EmbedBuilder} = require('discord.js')
const  axios  = require('axios')
const {cryptoAPI_key} = require('../config.json')
const { renderChange } = require('../modules/util')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription("search a crypto coin given it's name")
        .addStringOption(option =>
			option
				.setName('crypto')
				.setDescription('The cryptoCoin to search')
                .setRequired(true)),
    async execute(interaction){
        const cryptoCoin = interaction.options.getString('crypto');
    
    try{
        const res = await axios({
            url : 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest',
            method : 'GET',
            headers: {
                'X-CMC_PRO_API_KEY': cryptoAPI_key,
                Accept: 'application/json'
            },
            params: { 
                symbol: `${cryptoCoin}`
            }

        })
        
        const cryptoEmbed = new EmbedBuilder()
        const info = res.data.data[cryptoCoin][0];
        const quote = res.data.data[cryptoCoin][0].quote.USD
        
        cryptoEmbed.setTitle(`${info.name} (${info.symbol})`)
                .setAuthor({ name: 'CoinMarketCap', iconURL: 'https://play-lh.googleusercontent.com/hnfgT6tygOYj-XIIILixNYcsDTcu3-VTL3iT84rg2sG3VRFyDdLAJodsuC3IEkleKw'})
                .setDescription(`CoinMarketCap rank: ${info.cmc_rank}`)
                .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaMQI_SmmAsy-zYbLn3htCvgDnA_OXdeEDxhF_sCUDxZnNpkGIR7p2Kuk0GJOj-elUhsE&usqp=CAU")
                .addFields(
                    { name: 'price', value: `${quote.price.toFixed(2)} USD`},
                    // { name: '\u200B', value: '\u200B' },
                    { name: '1h %', value: renderChange(quote.percent_change_1h,cryptoEmbed,true), inline: true} ,
                    { name: '24h %', value: renderChange(quote.percent_change_24h,null, false), inline: true},
                    { name: '7d %', value: renderChange(quote.percent_change_7d,null,false) , inline: true}, 
                    { name: 'circulating supply', value: `${info.circulating_supply} ${cryptoCoin}`, inline: true} ,
                    { name: 'market cap dominance', value: `${quote.market_cap_dominance} %`, inline: true}

                );
        
        interaction.reply({ embeds: [cryptoEmbed] });
        
        } catch(err){
            interaction.reply('an error occured')
            console.log(err)
        }
    }
}