const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const RollDice = require('../../utils/RollDice.js');
const { name } = require('../../events/ready.js');

module.exports = {
    customID: 'madamemalkinsCompra',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        const file = fs.readFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        const roupasList = {
            vestes_comum_trabalho: {name:'Conjuntos de vestes comuns de trabalho (pretas)', price: 1, amount: 3},
            chapeu_pontudo_simples: {name:'Chapéu pontudo simples (preto)', price: 1, amount: 1},
            luvas_protetoras: {name:'Par de Luvas protetoras (couro de dragão ou similar)', price: 1, amount: 1},
            capa_inverno: {name:'Capa de inverno (preta, com fechos prateados)', price: 1, amount: 1},
        }

        let listCompras = []

        let totalCost = 0;
        for (const roupa in Object.values(roupasList)) {
            totalCost += roupa.price*roupa.amount;
        }
        if (userInv.inventario.galeoes && userInv.inventario.galeoes.amount >= totalCost) {
            return interaction.reply({ content: `Você não tenho galeões suficientes`, ephemeral: true });
        }
        
        for (const [key,roupa] of Object.entries(roupasList)) {
            if(!userInv.inventario[key]){
                userInv.inventario[key] = {name: roupa.name, amount: 1}
                userInv.inventario.galeoes.amount -= roupa.price*roupa.amount

                listCompras.push(`${roupa.amount} x ${roupa.name}`)
            }
        }
        fs.writeFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, JSON.stringify(userInv));

        if(listCompras.length > 0){
            return interaction.reply({ content: `*Você comprou as seguintes roupas:*${listCompras.map( elem => '\n* '+elem)}`, ephemeral: true });
        }else{
            return interaction.reply({ content: `Você já tem todas as roupas`, ephemeral: true });
        }
    }
}