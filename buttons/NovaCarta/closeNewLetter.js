const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const roleApprovals = '1325174179829645454'
module.exports = {
    customID: 'closeNewLetter',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const channelId = interaction.channelId;
        const channel = guild.channels.cache.get(channelId);

        if (channel && interaction.member.roles.cache.get(roleApprovals)) {
            await channel.delete();
        } 
    }
}