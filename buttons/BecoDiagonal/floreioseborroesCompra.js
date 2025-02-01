const fs = require('fs');

module.exports = {
    customID: 'floreioseborroesCompra',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        let file = fs.readFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        file = fs.readFileSync(`./RPGData/item_list.json`, 'utf8');
        const item_list = JSON.parse(file)

        const livroList = [
            'livro_padrao_feiticos',
            'livro_historia_magia',
            'livro_teoria_magia',
            'livro_transfiguracao_iniciantes',
            'livro_ervas_fungos_magicos',
            'livro_pocoes_avancadas',
            'livro_animais_fantasticos',
            'livro_forcas_das_trevas'
        ]

        let listCompras = []

        let totalCost = 0;
        livroList.forEach( livro => totalCost += item_list[livro].price )

        if (!userInv.inventario.galeoes && userInv.inventario.galeoes.amount < totalCost) {
            return interaction.reply({ content: `Você não tenho galeões suficientes`, ephemeral: true });
        }
        
        livroList.forEach( item => { 
            if(!userInv.inventario[item]){
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

                userInv.inventario.galeoes.amount -= item_list[item].price

                listCompras.push(item_list[item].name)
            }
        })
        fs.writeFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, JSON.stringify(userInv));

        if(listCompras.length > 0){
            return interaction.reply({ content: `*Você comprou os seguintes livros:*${listCompras.map( elem => '\n* '+elem)}`, ephemeral: true });
        }else{
            return interaction.reply({ content: `Você já tem todos os livros`, ephemeral: true });
        }
        
    }
}