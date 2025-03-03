const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags, EmbedBuilder, } = require("discord.js");
const { RemoveSpecialCharacters, importImage } = require("../utils/utils");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('foto')
        .setDescription('Adicionar Foto de Personagem - TEMPORARIO'),
    async execute(interaction, client) {

        try {

            await interaction.deferReply({ flags: MessageFlags.Ephemeral }).catch(() => { });

            const guild = client.guilds.cache.get(interaction.guildId);
            const member = guild.members.cache.get(interaction.user.id);
            const user = interaction.user;
            const channel = interaction.channel;
            const embed = new EmbedBuilder().setColor('#ffad00')

            const file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8');
            const ficha_player = JSON.parse(file)

            embed.setTitle("Criação de Foto de Personagem").setDescription('Adicione o link da foto ou a foto do seu personagem.')

            await interaction.editReply({ embeds: [embed], withResponse: true, flags: MessageFlags.Ephemeral })
            const filter = response => response.author.id === interaction.user.id;
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });
            const message = collected.first();

            let imageUrl = null;

            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                imageUrl = attachment.url;
            } else {
                imageUrl = message.content;
            }

            if (imageUrl) {
                const url = await importImage(imageUrl, user.username, user.id)

                const fetchedMessages = await channel.messages.fetch({ limit: 1 });
                await channel.bulkDelete(fetchedMessages, true);

                if (url) {
                    ficha_player.photo = url

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(ficha_player, null, 4));

                    embed.setDescription(`Parabéns. Você adicionou foto na sua ficha de personagem`);
                    embed.setImage(url)
                    await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });

                } else {
                    embed.setDescription('Erro importando imagem.\nTente novamente usar o comando em alguns minutos');
                    await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
                }

            } else {
                embed.setDescription('Nenhuma imagem ou URL válido foi fornecido.');
                await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            console.error(error)
        }
    },
};
