const { SlashCommandBuilder, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
        .setName('xpstore')
        .setDescription('[ADM] Criar loja de XP'),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false }).catch( () => {} );

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const fetchedMessages = await channel.messages.fetch({ limit: 1 });
        await channel.bulkDelete(fetchedMessages, true);

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Carta de Hogwats').setDescription(`✨ Bem-vindo à XP Emporium, onde a magia ganha vida! ✨

Entre sem medo, explore à vontade e deixe-se envolver pelo encanto dos nossos artefatos místicos. Das poções mais raras aos grimórios ancestrais, das varinhas encantadas aos talismãs de proteção, aqui encontrarás tudo o que um verdadeiro mago ou bruxa precisa.

Se procuras um feitiço para abrir caminhos, um amuleto para afastar energias negativas ou simplesmente um toque de magia para o teu dia, estás no lugar certo!

Que a tua visita seja repleta de mistério, descoberta e, acima de tudo... magia! 🔮✨`).setImage('https://imgur.com/4HUiueO.png');;
        

        const buttonSpell = new ButtonBuilder().setCustomId('buySpell').setStyle(ButtonStyle.Primary).setLabel('Comprar Magia - 5 XP').setEmoji('🔮');
        const buttonPericia = new ButtonBuilder().setCustomId('buyPericia').setStyle(ButtonStyle.Primary).setLabel('Comprar Perícia - 10 XP').setEmoji('🎓');
        const buttonAtributo = new ButtonBuilder().setCustomId('buyAtributo').setStyle(ButtonStyle.Primary).setLabel('Comprar Atributo - 10 XP').setEmoji('📚');
        const row = new ActionRowBuilder().addComponents(buttonSpell,buttonPericia,buttonAtributo);
    
        await interaction.editReply({ embeds: [embed], components: [row] });
    
    }
}