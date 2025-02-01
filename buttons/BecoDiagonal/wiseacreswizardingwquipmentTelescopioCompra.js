const fs = require('fs');
const item = 'telescopio';

module.exports = {
    customID: 'wiseacreswizardingwquipmentTelescopioCompra',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        let file = fs.readFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        file = fs.readFileSync(`./RPGData/item_list.json`, 'utf8');
        const item_list = JSON.parse(file)

        if(!userInv.inventario.galeoes || userInv.inventario.galeoes.amount < item_list[item].price){
            return interaction.reply({ content: `Você não tem Galeões suficientes`, ephemeral: true });
        }
        
        if(userInv.inventario[item]) {
            userInv.inventario[item].amount += 1
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
        }

        userInv.inventario.galeoes.amount -= 1;
        fs.writeFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, JSON.stringify(userInv));
        return interaction.reply({ content: `Você comprou **1 ${item_list[item].name}**`, ephemeral: true });
    }
}