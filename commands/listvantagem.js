const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    dm: true,
    data: new SlashCommandBuilder()
    .setName('listvantagem')
    .setDescription('Lista de Vantagens.'),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData/vantagem_list.json`, 'utf8');
        const vantagem_list = JSON.parse(file)

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Vantagens').setDescription(Object.entries(vantagem_list).map(([key, item]) => `* **${key}** - ${item.label} | **Custo:** ${item.custo} | **Bonus:** ${item.bonus} | ${item.effect}`).join('\n'));
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
