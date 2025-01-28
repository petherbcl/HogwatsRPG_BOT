const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const RollDice = require('../../utils/RollDice.js');

module.exports = {
    customID: 'caldeiroesdepotageCompra',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        const file = fs.readFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        if(!userInv.inventario.galeoes || userInv.inventario.galeoes.amount < 1){
            return interaction.reply({ content: `Você não tem Galeões suficientes`, ephemeral: true });
        }

        if(userInv.inventario.caldeirao_estanho_2) {
            return interaction.reply({ content: `Você já comprou seu caldeirão, ${member.user.username}`, ephemeral: true });
        }else{
            userInv.inventario.caldeirao_estanho_2 = {name: 'Caldeirão (estanho, tamanho padrão 2)', amount: 1};
            userInv.inventario.galeoes.amount -= 1;
            fs.writeFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, JSON.stringify(userInv));

            return interaction.reply({ content: `Você comprou sua 1 Caldeirão (estanho, tamanho padrão 2)`, ephemeral: true });
        }
    }
}