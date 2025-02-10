const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { setTimeout } = require('timers/promises');
const fs = require('fs');
const { RemoveSpecialCharacters } = require('../utils/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chapeuseletor')
        .setDescription('Inicia a seleção da casa'),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)
        const ficha_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8');
        const ficha = JSON.parse(ficha_file)

        if (!guild) {
            await interaction.editReply({ content: `⚠️ Servidor não encontrado!`, ephemeral: true });
            return;
        }

        if(channel.id === guild.channels.cache.find((c) => c.name === 'grande-salão').id && !userInv.casa) {

            const houseRoles = {
                'Grifinória': guild.roles.cache.find((r) => r.name === 'Grifinória').id,
                'Sonserina': guild.roles.cache.find((r) => r.name === 'Sonserina').id,
                'Corvinal': guild.roles.cache.find((r) => r.name === 'Corvinal').id,
                'Lufa-Lufa': guild.roles.cache.find((r) => r.name === 'LufaLufa').id
            };
            const houseImg = {
                'Grifinória': 'https://imgur.com/aAlMgXS.png',
                'Sonserina': 'https://imgur.com/R2Go1RD.png',
                'Corvinal': 'https://imgur.com/k25IsbE.png',
                'Lufa-Lufa': 'https://imgur.com/07HYIfq.png',
            };
    
            const phrases = [
                "<:sortinghat:1333596295708803094> Hmm, difícil... Muito difícil...",
                "<:sortinghat:1333596295708803094> Coragem, não falta...",
                "<:sortinghat:1333596295708803094> Ah, sim. E uma mente afiada...",
                "<:sortinghat:1333596295708803094> Há talento, oh, sim...",
                "<:sortinghat:1333596295708803094> E uma sede de provar seu valor...",
                "<:sortinghat:1333596295708803094> Mas onde colocá-lo?"
            ];
    
            for (const phrase of phrases) {
                await interaction.editReply({ content: phrase });
                await setTimeout(2000);
            }
    
            const role = guild.roles.cache.get(houseRoles[ficha.house]);
            const img = houseImg[ficha.house];
    
            if (role) {
                await member.roles.add(role);
                const embed = new EmbedBuilder().setImage(img).setDescription(`<:sortinghat:1333596295708803094> Parabéns **${member.nickname || member.user.globalName || member.user.username}**! Você foi selecionado para a casa **${ficha.house}**!`);
                await interaction.editReply({ content: '', embeds: [embed], ephemeral: false });

                userInv.casa = true;
                fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, JSON.stringify(userInv));
            } else {
                await interaction.editReply({ content: `⚠️ Não foi possível atribuir a casa. Role não encontrada.`, ephemeral: false });
            }
        }else{
            await interaction.followUp({ content: '⚠️ Não pode usar esse comando',ephemeral: false });
        }
        
    }
};