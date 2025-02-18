const fs = require('fs');
const { RemoveSpecialCharacters } = require('../../utils/utils');
const { MessageFlags } = require('discord.js');
const item = 'caldeirao_estanho_2';

module.exports = {
    customID: 'caldeiroesdepotageCompra',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        let file = fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        file = fs.readFileSync(`./RPGData/item_list.json`, 'utf8');
        const item_list = JSON.parse(file)

        if(!userInv.inventario.galeoes || userInv.inventario.galeoes.amount < item_list[item].price){
            return interaction.reply({ content: `Você não tem Galeões suficientes`, flags: MessageFlags.Ephemeral });
        }

        if(userInv.inventario[item]) {
            return interaction.reply({ content: `Você já comprou **${item_list[item].name}**`, flags: MessageFlags.Ephemeral });
        }else{
            userInv.inventario[item] = {
                amount: 1,
                name: item_list[item].name,
                description: item_list[item].description,
                type: item_list[item].type,
                // value: item_list[item].value,
                // weight: item_list[item].weight,
                // rarity: item_list[item].rarity,
                image: item_list[item].image
            };

            userInv.inventario.galeoes.amount -= item_list[item].price;
            
            fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, JSON.stringify(userInv));

            return interaction.reply({ content: `Você comprou sua 1 Caldeirão (estanho, tamanho padrão 2)`, flags: MessageFlags.Ephemeral });
        }
    }
}