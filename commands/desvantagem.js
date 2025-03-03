const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');
const { log } = require("../utils/utils");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('desvantagem')
    .setDescription('Lista de Desvantagens.'),
    async execute(interaction, client) {

        const guild = interaction.member.guild
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData/desvantagem_list.json`, 'utf8');
        const desvantagem_list = JSON.parse(file)

        const row = new ActionRowBuilder()
        const select = new StringSelectMenuBuilder().setCustomId(`selectdesvantagensdetails`).setPlaceholder('Selecione uma Desvantagem')
        const keys = Object.keys(desvantagem_list).sort( (a, b) => desvantagem_list[a].label.localeCompare(desvantagem_list[b].label) )
        for (const key of keys) {
            select.addOptions(new StringSelectMenuOptionBuilder().setLabel(desvantagem_list[key].label).setValue(key))
        }
        row.addComponents(select)

        const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Desvantagens').setDescription('Selecione uma Desvantagem para mais detalhes.')

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        log(guild,`<@${user.id}> usou comando ${"`/desvantagem`"} para consultar as desvantagens disponíveis.`);
    },
};

