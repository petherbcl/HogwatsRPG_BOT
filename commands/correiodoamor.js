const { SlashCommandBuilder, ActionRowBuilder, UserSelectMenuBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('correiodoamor')
        .setDescription('Envie uma mensagem especial para outro usuário!'),
    async execute(interaction, client) {
        // Cria o menu de seleção de usuários
        const userSelectMenu = new UserSelectMenuBuilder()
            .setCustomId('selectcartadoamor')
            .setPlaceholder('Selecione um usuário para enviar uma mensagem de amor')
            .setMinValues(1) // Número mínimo de seleções
            .setMaxValues(1); // Número máximo de seleções

        // Adiciona o menu de seleção a uma ActionRow
        const row = new ActionRowBuilder().addComponents(userSelectMenu);

        // Cria um embed para a interação
        const embed = new EmbedBuilder()
            .setColor('#ff69b4')
            .setTitle('Correio do Amor 💌')
            .setDescription('Selecione um usuário para enviar uma mensagem especial!');

        // Responde à interação com o menu de seleção
        const reply = await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral, // Apenas o usuário que executou o comando verá a mensagem
        });

        client.cache.set("selectcartadoamor_reply_"+interaction.user.id, reply);
    },

};