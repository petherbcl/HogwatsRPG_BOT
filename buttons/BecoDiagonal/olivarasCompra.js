const fs = require('fs');
const { RemoveSpecialCharacters, importImage } = require('../../utils/utils');
const { MessageFlags, EmbedBuilder } = require('discord.js');
const item = 'varinha';

const madeiras = ["Acácia", "Amieiro", "Macieira", "Freixo", "Álamo", "Faia", "Espinheiro-Negro", "Nogueira-negra", "Cedro", "Cerejeira", "Castanheira", "Cipestre", "Corniso", "Ébano", "Sabugueiro", "Olmo", "Carvalho Inglês", "Abeto", "Espinheiro-alvo", "Aveleira", "Azevinho", "Choupo-Branco", "Lariço", "Loureiro", "Bordo", "Pereira", "Pinho", "Choupo", "Carvalho", "Pau-Brasil", "Romeira", "Lima-prata", "Abeto Vermelho", "Figueira", "Videira", "Nogueira", "Salgueiro", "Teixo"]
const nucleo = ["Cabelo de Unicórnio", "Fibra de Coração de Dragão", "Pena de Fênix", "Pelo de Pumuruna", "Chifre de Serpente Chifruda Albina", "Pena de Thunderbird", "Fibra de Coração de Snallygaster", "Fragmento de Raiz de Mandrágura", "Pó de Presas de Basilisco", "Veneno de Acromântula", "Pelo da Cauda de Testrálios", "Pena de Hipogrifo", "Cabelo de Veela", "Escama de Sereiano", "Veneno de Basilisco", "Bigode de Trasgo Montanhês", "Essência de Cinzal"]

module.exports = {
    customID: 'olivarasCompra',
    async execute(interaction, client) {

        await interaction.deferReply({ flags: MessageFlags.Ephemeral }).catch(() => { });

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;
        const embed = new EmbedBuilder().setColor('#ffad00')

        let file = fs.readFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8');
        const userInv = JSON.parse(file)

        file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8');
        const ficha_player = JSON.parse(file)

        file = fs.readFileSync(`./RPGData/item_list.json`, 'utf8');
        const item_list = JSON.parse(file)

        if(!userInv.inventario.galeoes || userInv.inventario.galeoes.amount < item_list[item].price){
            return interaction.editReply({ content: `Você não tem Galeões suficientes`, ephemeral: true });
        }

        if(userInv.inventario[item]) {
            return interaction.editReply({ content: `Você já comprou sua ${item_list[item].name}`, ephemeral: true });
        }else{

            embed.setTitle("Criação de Varinha").setDescription('Adicione o link da foto ou a foto da sua varinha.')

            await interaction.editReply({ embeds: [embed], withResponse: true, flags: MessageFlags.Ephemeral })
            const filter = response => response.author.id === interaction.user.id;
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });
            const message = collected.first();

            let imageUrl = null;

            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                imageUrl = attachment.url;
            } else {
                imageUrl = message.content;
            }

            if (imageUrl) {
                const url = await importImage(imageUrl, user.username, user.id)

                const fetchedMessages = await channel.messages.fetch({ limit: 1 });
                await channel.bulkDelete(fetchedMessages, true);

                if (url) {
                    ficha_player.varinha = {
                        url: url,
                        madeira: madeiras[Math.floor(Math.random() * madeiras.length)],
                        nucleo: nucleo[Math.floor(Math.random() * nucleo.length)],
                        comprimento: Math.floor(Math.random() * (25 - 15 + 1)) + 15
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(ficha_player));

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
        
                    fs.writeFileSync(`./RPGData/players/inv_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, JSON.stringify(userInv));

                    embed.setDescription(`Parabéns. Você comprou uma varinha de **${ficha_player.varinha.madeira}** de **${ficha_player.varinha.comprimento}cm** com núcleo de **${ficha_player.varinha.nucleo}**`);
                    embed.setImage(url)
                    return interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });

                } else {
                    embed.setDescription('Erro importando imagem.\nTente novamente usar o comando em alguns inutos');
                    await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
                }

            } else {
                embed.setDescription('Nenhuma imagem ou URL válido foi fornecido.');
                await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }

        }
    }
}