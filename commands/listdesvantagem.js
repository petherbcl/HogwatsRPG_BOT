const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    dm: true,
    data: new SlashCommandBuilder()
    .setName('listdesvantagem')
    .setDescription('Lista de Desvantagens.'),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData/desvantagem_list.json`, 'utf8');
        const desvantagem_list = JSON.parse(file)

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Desvantagens').setDescription(Object.entries(desvantagem_list).map(([key, item]) => `* **${key}** - ${item.label} | **Custo:** ${item.custo} | **Bonus:** ${item.bonus} | ${item.effect}`).join('\n'));
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
