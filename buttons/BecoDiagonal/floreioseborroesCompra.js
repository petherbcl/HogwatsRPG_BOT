const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const RollDice = require('../../utils/RollDice.js');
const { name } = require('../../events/ready.js');

module.exports = {
    customID: 'floreioseborroesCompra',
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);

        const file = fs.readFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        const livroList = {
            livro_padrao_feiticos: {name:'O Livro Padrão de Feitiços (1ª série) de Miranda Goshawk', price: 1},
            historia_magia: {name:'História da Magia de Batilda Bagshot', price: 1},
            teoria_magia: {name:'Teoria da Magia de Adalberto Waffling', price: 1},
            transfiguracao_iniciantes: {name:'Guia de Transfiguração para Iniciantes de Emerico Switch', price: 1},
            ervas_fungos_magicos: {name:'Mil Ervas e Fungos Mágicos de Fílida Spore', price: 1},
            pocoes_avancadas: {name:'Bebidas e Poções Mágicas de Arsênio Jigger', price: 1},
            animais_fantasticos: {name: 'Animais Fantásticos e Onde Habitam de Newt Scamander', price: 1},
            forcas_das_trevas: {name: 'As Forças das Trevas: Um Guia de Autoproteção de Quintino Trimble', price:1}
        }

        let listCompras = []

        let totalCost = 0;
        for (const livro in Object.values(livroList)) {
            totalCost += livro.price;
        }
        if (userInv.inventario.galeoes && userInv.inventario.galeoes.amount >= totalCost) {
            return interaction.reply({ content: `Você não tenho galeões suficientes`, ephemeral: true });
        }
        
        for (const [key,livro] of Object.entries(livroList)) {
            if(!userInv.inventario[key]){
                userInv.inventario[key] = {name: livro.name, amount: 1}
                userInv.inventario.galeoes.amount -= livro.price

                listCompras.push(livro.name)
            }
        }
        fs.writeFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, JSON.stringify(userInv));

        if(listCompras.length > 0){
            return interaction.reply({ content: `*Você comprou os seguintes livros:*${listCompras.map( elem => '\n* '+elem)}`, ephemeral: true });
        }else{
            return interaction.reply({ content: `Você já tem todos os livros`, ephemeral: true });
        }
        

        // if(userInv.gringots) {
        //     return interaction.reply({ content: `Você já levantou seus galeões, ${member.user.username}`, ephemeral: true });
        // }else{
        //     const dice = RollDice.rollDice('1D6').total;
        //     const galeoes = dice * 100;
        //     userInv.gringots = true;
        //     userInv.inventario.galeoes = {name: 'Galeões', amount: galeoes};
        //     fs.writeFileSync(`./RPGData/players/inv_${member.user.username}_${member.user.id}.json`, JSON.stringify(userInv));

        //     return interaction.reply({ content: `Você lançou o dado e obteve ${dice}, multiplicando por 100 você obteve ${galeoes} galeões, ${member.user.username}`, ephemeral: true });
        // }
    }
}