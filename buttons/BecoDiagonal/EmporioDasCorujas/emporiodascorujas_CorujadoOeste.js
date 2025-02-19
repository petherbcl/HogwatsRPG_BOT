const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { RemoveSpecialCharacters } = require('../../../utils/utils');

const name = 'Coruja do Oeste'
const price = 10
const img = 'https://imgur.com/xj8CMWO.png'

module.exports = {
    customID: 'emporiodascorujas_CorujadoOeste',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        const file = fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        if(!userInv.inventario.galeoes || userInv.inventario.galeoes.amount < price){
            return interaction.reply({ content: `Você não tem Galeões suficientes`, ephemeral: true });
        }

        if (userInv.inventario.animal) {
            userInv.inventario.animal = null
            userInv.inventario.galeoes.amount += 10
        }
        userInv.inventario.galeoes.amount -= price;
        userInv.inventario.animal = { name: name, type: 'owl', img: img, amount: 1 }

        fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, JSON.stringify(userInv));
        const embed = new EmbedBuilder().setColor('#ffad00').setImage(img).setDescription(`Você comprou 1 ${name}`);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}