const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    dm: true,
    data: new SlashCommandBuilder()
    .setName('deletemsg')
    .setDescription('Deleta mensagens do canal.')
    .addStringOption(option => option.setName('qtd').setDescription('numero de mensagens a deletar').setRequired(true)),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        let qtd = interaction.options.getString('qtd');
        qtd = parseInt(qtd);
        if(isNaN(qtd)){
            qtd = 1
        }

        const fetchedMessages = await channel.messages.fetch({ limit: qtd });
        await channel.bulkDelete(fetchedMessages, true);

        await interaction.reply({ content: `**${qtd}** mensagens deletadas.`, ephemeral: true });
    },
};
