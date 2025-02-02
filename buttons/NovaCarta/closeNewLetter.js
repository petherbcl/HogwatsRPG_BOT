module.exports = {
    customID: 'closeNewLetter',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const channelId = interaction.channelId;
        const channel = guild.channels.cache.get(channelId);

        if (channel && interaction.member.roles.cache.find((role) => role.name === 'DM')) {
            await channel.delete();
        } 
    }
}