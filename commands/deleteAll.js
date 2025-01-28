const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
        .setName('deleteall')
        .setDescription('[ADM] Delete all channels'),
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true }).catch( () => {} );

        const guild = interaction.member.guild

        if (!guild) {
            await interaction.followUp({ content: `⚠️ Servidor não encontrado!`, ephemeral: true })
            return;
        }


        for (let category of client.structure) {
            const canalCat = guild.channels.cache.find( c=> c.name === category.name && c.type === 4);
            if (canalCat) {
                await canalCat.delete();
                console.log(`Categoria ${category.name} excluída com sucesso.`);
            }

            for (const channel of category.channels) {
                const canal = guild.channels.cache.find( c=> c.name === channel.name && c.type === channel.type);
                if (canal) {
                    await canal.delete();
                    console.log(`Canal ${channel.name} excluído com sucesso.`);
                }
            }
        }

        await interaction.followUp({ content: `⚠️ Processo de exclusão de canais concluído!`, ephemeral: true })

        for( let roles of Object.values(client.roomRoles) ) {
            const role = guild.roles.cache.find( r=> r.name === roles);
            if (role) {
                await role.delete();
                console.log(`Role ${role.name} excluída com sucesso.`);
            }
        }

        for( let roles of client.rpgRoles ) {
            const role = guild.roles.cache.find( r=> r.name === roles.name);
            if (role) {
                await role.delete();
                console.log(`Role ${role.name} excluída com sucesso.`);
            }
        }

        await interaction.followUp({ content: `⚠️ Processo de exclusão de roles concluído!`, ephemeral: true })

    }
}