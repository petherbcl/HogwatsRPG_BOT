const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    dm: true,
    data: new SlashCommandBuilder()
    .setName('additem')
    .setDescription('Adiciona item ao player.')
    .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
    .addStringOption(option => option.setName('item').setDescription('Código do item').setRequired(true))
    .addStringOption(option => option.setName('quantidade').setDescription('Quantidade').setRequired(false)),
    async execute(interaction, client) {
        
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData/item_list.json`, 'utf8');
        const item_list = JSON.parse(file)
        
        const player = interaction.options.getString('player');
        const playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
        const player_user = guild.members.cache.get(playerID); // Get the member object from the ID
        const item = interaction.options.getString('item');
        const quantidade = interaction.options.getString('quantidade') || 1;

        if (!item_list[item]) {
            return interaction.reply({ content: `Item **${item}** não existe.`, ephemeral: true });
        }

        if (!player_user) {
            return interaction.reply({ content: `Player **${player}** não existe.`, ephemeral: true });
        }

        if (quantidade <= 0) {
            return interaction.reply({ content: `Quantidade deverá ser maior que 0.`, ephemeral: true });
        }

        const player_file = fs.readFileSync(`./RPGData/players/inv_${player_user.user.username}_${player_user.user.id}.json`, 'utf8');
        const player_inv = JSON.parse(player_file)

        if(player_inv.inventario[item]){
            player_inv.inventario[item].amount += quantidade;
        } else {
            player_inv.inventario[item] = {
                amount: quantidade,
                name: item_list[item].name,
                description: item_list[item].description,
                type: item_list[item].type,
                // value: item_list[item].value,
                // weight: item_list[item].weight,
                // rarity: item_list[item].rarity,
                image: item_list[item].image
            };
        }

        fs.writeFileSync(`./RPGData/players/inv_${player_user.user.username}_${player_user.user.id}.json`, JSON.stringify(player_inv));
        
        return interaction.reply({ content: `Adicionado **${quantidade} x ${item_list[item].name}** ao player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**.`, ephemeral: false });

    },
};
