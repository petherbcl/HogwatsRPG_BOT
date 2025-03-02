const fs = require('fs');
const { MessageFlags, EmbedBuilder } = require('discord.js');
const { RemoveSpecialCharacters } = require('../../utils/utils');
const pericia_by_year = JSON.parse(fs.readFileSync(`./RPGData/pericias_by_year.json`, 'utf8'))
const pericia_list = JSON.parse(fs.readFileSync(`./RPGData/pericias.json`, 'utf8'))


module.exports = {
    customID: 'selectbuypericia',
    async execute(interaction, client) {
        const user = interaction.user;
        const pericia = interaction.values[0];

        const ficha_player = JSON.parse(fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))
        const inv_player = JSON.parse(fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8'))

        ficha_player.pericias.push(pericia)
        ficha_player.PE -= 10;
        inv_player.pericia_buy_info[ficha_player.year] = inv_player.pericia_buy_info[ficha_player.year] ? inv_player.pericia_buy_info[ficha_player.year] + 1 : 1;

        fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(ficha_player, null, 2));
        fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(inv_player, null, 4))

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Compra de Perícia').setDescription(`Você desbloqueou a perícia **${pericia_list[pericia].name}**`).setImage('https://imgur.com/YF7QPAV.png');

        await interaction.update({ embeds: [embed], components: [], flags: MessageFlags.Ephemeral });

    }
}