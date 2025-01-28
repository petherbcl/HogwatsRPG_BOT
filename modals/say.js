module.exports = {
	customID: 'say',
	async execute(interaction, client) {
		const AI = require('../gemini/startAI.js');
		
		const message = interaction.fields.getTextInputValue('message');
		await interaction.deferReply({ ephemeral: true });
		
		AI.StartAI(client, interaction)
		const response = await AI.AskQuestion(client, interaction, message);
		
		try {

			if (response.length > 2000) {
				const replyArray = response.match(/[\s\S]{1,2000}/g);
				replyArray.forEach(async (msg) => {
				  await interaction.channel.send(msg);
				});
				await interaction.deleteReply();
				return;
			  }

			await interaction.channel.send(response);
			await interaction.deleteReply();
		} catch (error) {
			await interaction.editReply('Failed to send message - Check I have permission to send messages in this channel!');
		}
	}
}