const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const RollDice = require('../../utils/RollDice.js');

module.exports = {
    customID: 'gringotsLevantar',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        const file = fs.readFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        if(userInv.gringots) {
            return interaction.reply({ content: `Você já levantou seus galeões, ${member.user.username}`, ephemeral: true });
        }else{
            const dice = RollDice.rollDice('1D6').total;
            const galeoes = dice * 100;
            userInv.gringots = true;
            userInv.inventario.galeoes = {name: 'Galeões', amount: galeoes};
            fs.writeFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, JSON.stringify(userInv));

            return interaction.reply({ content: `Você lançou o dado e obteve ${dice}, multiplicando por 100 você obteve ${galeoes} galeões, ${member.user.username}`, ephemeral: true });
        }
    }
}