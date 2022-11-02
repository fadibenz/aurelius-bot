const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { api_key } = require("../config.json")
const axios = require('axios')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('company')
        .setDescription("Daily snapshot of public company information.")
        .addStringOption(option =>
			option
				.setName('company')
				.setDescription('company to search')
                .setRequired(true)),
    
    async execute(interaction){
        const company = interaction.options.getString('company')
            try{
                const res = await axios({
                    url:`https://workspace.iex.cloud/v1/data/core/COMPANY/${company}?token=${api_key}`,
                    method: 'GET'
                })
                const photo = await axios({
                    url: `https://api.unsplash.com/search/photos/?client_id=sAnWOJqxc2EPWdbSbOG1v7YbT8D2W9RGYJEx5AC8xlo`,
                    method: 'GET',
                    params :{
                        query: `${res.data[0].companyName.split(' ')[0]}`
                    }
                }) 
                
                const companyEmbed = new EmbedBuilder()                
                        .setTitle(`${res.data[0].companyName} (${res.data[0].symbol}) `)
                        .setAuthor({ name: 'IEX cloud', iconURL: 'https://miro.medium.com/max/600/0*oSQC-_PkXNZ-0mfI.png'})
                        .setDescription(`${res.data[0].shortDescription}`)
                        .setThumbnail(photo.data.results[0].urls.full)
                        .addFields(
                            { name: 'CEO', value: `${res.data[0].ceo}`},
                            { name: 'industry', value:`${res.data[0].industry}` } ,
                            { name: 'employees', value: `${res.data[0].employees}`} ,
                            { name: 'Website', value: `${res.data[0].website}`} 
                        )
                
                interaction.reply({ embeds: [companyEmbed] });
             }
            catch (err){
                console.log(err)
                interaction.reply("must provide valid Symbol");
            }
    }
}