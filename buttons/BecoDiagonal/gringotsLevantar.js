const fs = require('fs');
const { RemoveSpecialCharacters } = require('../../utils/utils');
const item = 'galeoes';
const RollDice = require('../../utils/RollDice.js');

module.exports = {
    customID: 'gringotsLevantar',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        let file = fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        file = fs.readFileSync(`./RPGData/item_list.json`, 'utf8');
        const item_list = JSON.parse(file)

        if(userInv.gringots) {
            return interaction.reply({ content: `Você já levantou seus ${item_list[item].name}`, ephemeral: true });
        }else{
            const dice = RollDice.rollDice('1D6').total;
            const galeoes = dice * 100;
            userInv.gringots = true;
            userInv.inventario[item] = {
                amount: galeoes,
                name: item_list[item].name,
                description: item_list[item].description,
                type: item_list[item].type,
                // value: item_list[item].value,
                // weight: item_list[item].weight,
                // rarity: item_list[item].rarity,
                image: item_list[item].image
            };

            fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.json`, JSON.stringify(userInv));

            return interaction.reply({ content: `Você lançou o dado e obteve ${dice}, multiplicando por 100 você obteve ${galeoes} ${item_list[item].description}`, ephemeral: true });
        }
    }
}