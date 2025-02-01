const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
    .setName('listitem')
    .setDescription('Lista os item.'),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData//item_list.json`, 'utf8');
        const item_list = JSON.parse(file)

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Itens').setDescription(Object.entries(item_list).map(([key, value]) => `* **${key}** - ${value.name} | *${value.description}*`).join('\n'));
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
