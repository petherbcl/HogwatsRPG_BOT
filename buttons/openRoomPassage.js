const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");

const mensagens = [
    'Para onde será que eu vou agora?',
    'Huumm... por onde?',
    'Será que vou por aqui?'
]

module.exports = {
	customID: 'openRoomPassage',
	async execute(interaction, client) {
        const guild = interaction.member.guild;
        const channel = guild.channels.cache.get(interaction.channelId)
        
        let buttons = [];

        for(const room of client.roomsList[channel.name]){
            let allow = true
            if(room.role && !interaction.member.roles.cache.find((role) => role.name === room.role)){
                allow = false
            }

            if(allow){
                buttons.push( new ButtonBuilder().setCustomId(room.room).setStyle( room.role ? ButtonStyle.Success : ButtonStyle.Primary).setLabel(room.label) )
            }
        }

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Passagens').setDescription(mensagens[Math.floor(Math.random() * mensagens.length)])
        let buttonsAux = [...buttons]
        let row = []
        while(buttonsAux.length > 0){
            row.push({type:1, components: [...buttonsAux.slice(0,5)] })
            buttonsAux = buttonsAux.slice(5)
        }
        await interaction.reply({ embeds: [embed], components: row, flags: MessageFlags.Ephemeral });
	}
}


