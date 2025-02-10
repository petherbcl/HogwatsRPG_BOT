const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { RemoveSpecialCharacters } = require('../../utils/utils');
const RollDice = require('../../utils/RollDice.js');
const { name } = require('../../events/ready.js');

module.exports = {
    customID: 'madamemalkinsCompra',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        let file = fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        file = fs.readFileSync(`./RPGData/item_list.json`, 'utf8');
        const item_list = JSON.parse(file)

        const roupasList = {
            vestes_comum_trabalho: { amount: 3},
            chapeu_pontudo_simples: { amount: 1},
            luvas_protetoras: { amount: 1},
            capa_inverno: { amount: 1},
        }

        let listCompras = []

        let totalCost = 0;
        for (const [item,roupa] in Object.entries(roupasList)) {
            totalCost += item_list[item].price*roupa.amount;
        }
        if (userInv.inventario.galeoes && userInv.inventario.galeoes.amount >= totalCost) {
            return interaction.reply({ content: `Você não tenho galeões suficientes`, ephemeral: true });
        }
        
        for (const [item,roupa] of Object.entries(roupasList)) {
            if(!userInv.inventario[item]){
                userInv.inventario[item] = {
                    amount: roupa.amount,
                    name: item_list[item].name,
                    description: item_list[item].description,
                    type: item_list[item].type,
                    // value: item_list[item].value,
                    // weight: item_list[item].weight,
                    // rarity: item_list[item].rarity,
                    image: item_list[item].image
                };

                userInv.inventario.galeoes.amount -= item_list[item].price*roupa.amount

                listCompras.push(`${roupa.amount} x ${item_list[item].name}`)
            }
        }
        fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, JSON.stringify(userInv));

        if(listCompras.length > 0){
            return interaction.reply({ content: `*Você comprou as seguintes roupas:*${listCompras.map( elem => '\n* '+elem)}`, ephemeral: true });
        }else{
            return interaction.reply({ content: `Você já tem todas as roupas`, ephemeral: true });
        }
    }
}