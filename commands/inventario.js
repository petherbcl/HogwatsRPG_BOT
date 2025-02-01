const { SlashCommandBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('inventario')
    .setDescription('Consulta inventário.'),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        // const user = interaction.user;
        // const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, 'utf8');
        const user_inv = JSON.parse(file)

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Itens do Inventário').setDescription(Object.entries(user_inv.inventario).map(([key, item]) => `* **${key}** - ${item.amount} x ${item.name} | *${item.description}*`).join('\n'));
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
