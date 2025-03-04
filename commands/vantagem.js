const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder, MessageFlags,  } = require("discord.js");
const fs = require('fs');
const { log } = require("../utils/utils");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vantagem')
    .setDescription('Lista de Vantagens.'),
    async execute(interaction, client) {

        const guild = interaction.member.guild
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const vantagem_list = JSON.parse(fs.readFileSync(`./RPGData/vantagem_list.json`, 'utf8'))

        const row = new ActionRowBuilder()
        const select = new StringSelectMenuBuilder().setCustomId(`selecvantagensdetails`).setPlaceholder('Selecione uma Vantagem')
        const keys = Object.keys(vantagem_list).sort( (a, b) => vantagem_list[a].label.localeCompare(vantagem_list[b].label) )
        for (const key of keys) {
            select.addOptions(new StringSelectMenuOptionBuilder().setLabel(vantagem_list[key].label).setValue(key))
        }
        row.addComponents(select)

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Vantagens').setDescription('Selecione uma Vantagem para mais detalhes.')

        await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });

        log(guild,`<@${user.id}> usou comando ${"`/vantagem`"} para consultar as vantagens disponíveis.`);
    },
};
