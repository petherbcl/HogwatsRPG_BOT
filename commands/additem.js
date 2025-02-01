const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder,  } = require("discord.js");
const fs = require('fs');
const { console } = require("inspector");

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
    .setName('additem')
    .setDescription('Adiciona item ao player.')
    .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
    .addStringOption(option => option.setName('item').setDescription('Código do item a adicionar').setRequired(true)),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData//item_list.json`, 'utf8');
        const item_list = JSON.parse(file)
        
        const player = interaction.options.getString('player');
        const item = interaction.options.getString('item');

        if (!item_list[item]) {
            return interaction.reply({ content: `Item **${item}** não existe.`, ephemeral: true });
        }

        

        
    },
};
