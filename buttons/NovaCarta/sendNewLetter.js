const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

const roleApprovalsAllow = ['ViewChannel', 'UseApplicationCommands', 'SendMessages','AddReactions','AttachFiles','ReadMessageHistory']
const roleApprovalsDeny = []
const userAllow = ['ViewChannel', 'UseApplicationCommands', 'SendMessages','AddReactions','AttachFiles','ReadMessageHistory']

function removeSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
}

module.exports = {
	customID: 'sendNewLetter',
	async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        let categoryChannel = guild.channels.cache.find((c) => c.name === '╭--🔹Chegada🔹--╮' && c.type === 4);
        if (categoryChannel) {
            const user = interaction.user;
            
            let channel = guild.channels.cache.find((c) => c.name === `carta-de-${removeSpecialCharacters(user.username)}-${user.id}` && c.type === 0);
            if(!channel){
                channel = await guild.channels.create({
                    name: `carta-de-${user.username}-${user.id}`,
                    type: 0,
                    parent: categoryChannel.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.cache.find((r) => r.name === 'DM').id,
                            allow: roleApprovalsAllow.map((p) => PermissionsBitField.Flags[p]),
                            deny: roleApprovalsDeny.map((p) => PermissionsBitField.Flags[p]),
                        },
                        {
                            id: user.id,
                            allow: userAllow.map((p) => PermissionsBitField.Flags[p])
                        }
                    ]
                })
            }

            const embed = new EmbedBuilder().setColor('#ffad00').setDescription(`Uma nova sala <#${channel.id}> foi criada para você enviar sua carta.`);
            await interaction.reply({ embeds: [embed], ephemeral: true });

            const embedChannel = new EmbedBuilder().setColor('#ffad00').setTitle('Carta de Hogwats').setDescription(`Olá ${user.username}. 
Nesse canal você pode enviar sua ficha de personagem completa.
Após o envio, aguarde a aprovação de um dos DMs.`);
            const button = new ButtonBuilder().setCustomId('closeNewLetter').setStyle(ButtonStyle.Danger).setLabel('Fechar Canal');
            const row = new ActionRowBuilder().addComponents(button);
            await channel.send({ embeds: [embedChannel], components: [row], ephemeral: false });
        }
	}
}