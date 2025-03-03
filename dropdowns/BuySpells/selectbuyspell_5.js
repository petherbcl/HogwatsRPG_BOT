const fs = require('fs');
const { MessageFlags, EmbedBuilder } = require('discord.js');
const { buySpell } = require('../../utils/utils');
const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))

module.exports = {
    customID: 'selectbuyspell_0',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;
        
        const value = interaction.values[0];
        const buyspell = buySpell(user.username, user.id, value);
        const embed = new EmbedBuilder().setColor('#ffad00')
        if (buyspell) {
            embed.setTitle('Feitiço Desbloqueado')
                .setDescription(`Você desbloqueou o feitiço **${spell_list[value].name}**`)
                .setImage('https://imgur.com/QI4nKvZ.png');
        } else {
            embed.setTitle('Feitiço não desbloqueado')
                .setDescription(`Você não tem Pontos de Experiência suficientes para comprar esse feitiço`)
                .setImage('https://imgur.com/4HUiueO.png');
            log(guild, `<@${user.id}> usou ${spell_list[value].custo || 5} PE para comprar feitiço **${spell_list[value].name}**.`)
        }

        await interaction.update({ embeds: [embed], components: [], flags: MessageFlags.Ephemeral });

    }
}