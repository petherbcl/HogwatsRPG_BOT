const fs = require('fs');
const { MessageFlags, EmbedBuilder } = require('discord.js');
const { RemoveSpecialCharacters, log } = require('../../utils/utils');
const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))

const attr_desc = {
    'F': 'Força',
    'H': 'Habilidade',
    'R': 'Resistência',
    'A': 'Armadura',
    'PdF': 'Poder de Fogo'
}

module.exports = {
    customID: 'selectbuyatributo',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;
        
        const atributo = interaction.values[0];

        const ficha_player = JSON.parse(fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))
        const inv_player = JSON.parse(fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))

        const embed = new EmbedBuilder().setColor('#ffad00')
        if(ficha_player.PE < 10){
            embed.setTitle('Compra de Atributo').setDescription('Você não tem Pontos de Experiência suficientes para comprar um atributo.').setImage('https://imgur.com/4HUiueO.png');
        }else{
            ficha_player[atributo]++
            if(atributo == 'R'){
                const pvpercentage = ficha_player.PV/ficha_player.PVMax
                const pmpercentage = ficha_player.PM/ficha_player.PMMax

                ficha_player.PVMax = ficha_player[atributo] * 5;
                ficha_player.PMMax = ficha_player[atributo] * 5;

                ficha_player.PV = Math.floor(ficha_player.PVMax * pvpercentage)
                ficha_player.PM = Math.floor(ficha_player.PMMax * pmpercentage)
                
            }

            ficha_player.PE -= 10;
            ficha_player.PE = ficha_player.PE < 0 ? 0 : ficha_player.PE;
            inv_player.atributobuy = inv_player.atributobuy ? inv_player.atributobuy + 1 : 1;
            fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(ficha_player, null, 4));
            fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(inv_player, null, 4))
    
            embed.setTitle('Compra de Atributo')
                .setDescription(`Você aumentou o atributo **${attr_desc[atributo]}**`)
                .setImage('https://imgur.com/QI4nKvZ.png');
        }

        log(guild,`<@${user.id}> usou 10 PE para comprar um atributo **${attr_desc[atributo]}**.`)

        return await interaction.update({ embeds: [embed], components: [], flags: MessageFlags.Ephemeral });

    }
}