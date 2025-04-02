const { MessageFlags, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");
const fs = require('fs');

module.exports = {
    customID: 'selectcartadoamor',
    async execute(interaction, client) {
        
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const value = interaction.values[0];
        const player_user = guild.members.cache.get(value); // Get the member object from the ID

        if(!player_user) {
            return interaction.update({ content: 'Usuário não encontrado.', flags: MessageFlags.Ephemeral });
        }

        client.cache.set("selectcartadoamor_"+interaction.user.id, value);

        const modal = new ModalBuilder()
		.setTitle('Say something!')
		.setCustomId('modalmensagemdoamor')

		const input = new TextInputBuilder()
		.setCustomId('message')
		.setPlaceholder('Escreva sua mensagem aqui!')
		.setLabel('Mensagem')
		.setStyle(TextInputStyle.Paragraph)

		const question = new ActionRowBuilder().addComponents(input)

		modal.addComponents(question)
		await interaction.showModal(modal)

        await client.cache.get("selectcartadoamor_reply_"+interaction.user.id).delete();
        client.cache.delete("selectcartadoamor_reply_"+interaction.user.id);
    }
}