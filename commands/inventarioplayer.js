const { SlashCommandBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
    .setName('inventarioplayer')
    .setDescription('Consulta inventário do player.')
    .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true)),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        const player = interaction.options.getString('player');
        const playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
        const player_user = guild.members.cache.get(playerID); // Get the member object from the ID

        if (!player_user) {
            return interaction.reply({ content: `Player **${player}** não existe.`, ephemeral: true });
        }

        const file = fs.readFileSync(`./RPGData/players/inv_${player_user.user.username}_${player_user.user.id}.json`, 'utf8');
        const user_inv = JSON.parse(file)

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle(`Lista de Itens do Inventário do Player - ${player_user.nickname || player_user.user.globalName || player_user.user.username}`).setDescription(Object.entries(user_inv.inventario).map(([key, item]) => `* **${key}** - ${item.amount} x ${item.name} | *${item.description}*`).join('\n'));
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
