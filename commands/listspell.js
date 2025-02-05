const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    dm: true,
    data: new SlashCommandBuilder()
    .setName('listspell')
    .setDescription('Lista os feitiços.'),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData/spell_list.json`, 'utf8');
        const spell_list = JSON.parse(file)

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Feitiços').setDescription(Object.entries(spell_list).map(([key, item]) => `* **${key}** - ${item.name} | *${item.pm}* PM | ${item.effect}`).join('\n'));
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
