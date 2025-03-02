const fs = require('fs');
const { MessageFlags, EmbedBuilder } = require('discord.js');
const { increateAtributo, RemoveSpecialCharacters } = require('../../utils/utils');
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
        const user = interaction.user;
        const atributo = interaction.values[0];

        const ficha_player = JSON.parse(fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))
        const inv_player = JSON.parse(fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))

        const embed = new EmbedBuilder().setColor('#ffad00')
        if(ficha_player.PE < 10){
            embed.setTitle('Compra de Atributo').setDescription('Você não tem Pontos de Experiência suficientes para comprar um atributo.').setImage('https://imgur.com/4HUiueO.png');
        }else{
            ficha_player[atributo]++
            ficha_player.PE -= 10;
            inv_player.atributobuy = inv_player.atributobuy ? inv_player.atributobuy + 1 : 1;
            fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(ficha_player, null, 2));
            fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(inv_player, null, 4))
    
            embed.setTitle('Compra de Atributo')
                .setDescription(`Você aumentou o atributo **${attr_desc[atributo]}**`)
                .setImage('https://imgur.com/QI4nKvZ.png');
        }

        await interaction.update({ embeds: [embed], components: [], flags: MessageFlags.Ephemeral });

    }
}