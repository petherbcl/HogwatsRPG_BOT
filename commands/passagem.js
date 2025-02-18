const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags,  } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('passagem')
    .setDescription('Passagens disponiveis'),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        if(Object.keys(client.roomsList).filter( r => r === channel.name).length > 0){

            const button = new ButtonBuilder().setCustomId('openRoomPassage').setStyle(ButtonStyle.Primary).setLabel('Ver Passagens');
            const row = new ActionRowBuilder().addComponents(button);

            await interaction.reply({components: [row], flags: MessageFlags.Ephemeral});
        }else{
            await interaction.reply({content: 'Não existe passagem disponível', flags: MessageFlags.Ephemeral});
        }
    },
};
