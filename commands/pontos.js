const { SlashCommandBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pontos')
    .setDescription('Pontos das Casas.')
        .addSubcommand(command => command.setName('check')
            .setDescription('Mostra Pontos as Casas')
        )
        .addSubcommand(command => command.setName('add')
            .setDescription('[DM] Adicionar Pontos a Casa')
            .addStringOption(option => option.setName('casa').setDescription('Grifinória , Sonserina , Lufa-Lufa , Corvinal').setRequired(true))
            .addStringOption(option => option.setName('pontos').setDescription('Pontos a adicionar').setRequired(true))
        )
        .addSubcommand(command => command.setName('rem')
            .setDescription('[DM] Remover Pontos a Casa')
            .addStringOption(option => option.setName('casa').setDescription('Grifinória , Sonserina , Lufa-Lufa , Corvinal').setRequired(true))
            .addStringOption(option => option.setName('pontos').setDescription('Pontos a retirar').setRequired(true))
        )
    ,
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;
        const pontosChannel = guild.channels.cache.find((c) => c.name === 'pontos-das-casas');

        const file = fs.readFileSync(`./RPGData/pontos_casas.json`, 'utf8');
        const pontos_file = JSON.parse(file)

        const isDM =  interaction.member.roles.cache.find((role) => role.name === 'DM')
        const option = interaction.options.getSubcommand();

        if(option === 'check'){

            const embed = new EmbedBuilder()
                .setColor('#ffad00')
                .setTitle('🏆 Pontos das Casas 🏆')
                .addFields(
                    { name: '<:gryffindor:1333855085033422919> Grifinória <:gryffindor:1333855085033422919>', value: '```'+(pontos_file.gryffindor || 0)+' Pontos```' },
                    { name: '<:slytherin:1333855075176546314> Sonserina <:slytherin:1333855075176546314>', value: '```'+(pontos_file.slytherin || 0)+' Pontos```' },
                    { name: '<:hufflupuff:1333855082202271878> Lufa-Lufa <:hufflupuff:1333855082202271878>', value: '```'+(pontos_file.hufflupuff || 0)+' Pontos```' },
                    { name: '<:ravenclaw:1333855083741446145> Corvinal <:ravenclaw:1333855083741446145>', value: '```'+(pontos_file.ravenclaw || 0)+' Pontos```' }
                )
            ;
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }else if(isDM && option === 'add'){
            const house = interaction.options.getString('casa');
            const pontos = Math.abs(Number(interaction.options.getString('pontos')));
            let casa_pontos_embed = new EmbedBuilder().setColor('#ffad00')
            let msg = ''
            
            if(!['GRIFINORIA','GRIFINÓRIA','SONSERINA', 'LUFALUFA', 'LUFA-LUFA', 'CORVINAL'].includes(house.toUpperCase())){
                return interaction.reply({ content: `Nome de casa errado`, ephemeral: true }); 
            }

            if(['GRIFINORIA','GRIFINÓRIA'].includes(house.toUpperCase())){
                pontos_file.gryffindor = (pontos_file.gryffindor || 0) + pontos
                casa_pontos_embed.setTitle(`${pontos} pontos para Grifinória`)
                casa_pontos_embed.setDescription(`Professor(a) <@${user.id}> deu ${pontos} pontos a Grifinória`)
                casa_pontos_embed.setThumbnail('https://imgur.com/aAlMgXS.png')
                msg = `Deu ${pontos} pontos a Grifinória`
            
            }else if(['SONSERINA'].includes(house.toUpperCase())){
                pontos_file.slytherin = (pontos_file.slytherin || 0) + pontos
                casa_pontos_embed.setTitle(`${pontos} pontos para Sonserina`)
                casa_pontos_embed.setDescription(`Professor(a) <@${user.id}> deu ${pontos} pontos a Sonserina`)
                casa_pontos_embed.setThumbnail('https://imgur.com/R2Go1RD.png')
                msg = `Deu ${pontos} pontos a Sonserina`

            }else if(['LUFALUFA', 'LUFA-LUFA'].includes(house.toUpperCase())){
                pontos_file.hufflupuff = (pontos_file.hufflupuff || 0) + pontos
                casa_pontos_embed.setTitle(`${pontos} pontos para Lufa-Lufa`)
                casa_pontos_embed.setDescription(`Professor(a) <@${user.id}> deu ${pontos} pontos a Lufa-Lufa`)
                casa_pontos_embed.setThumbnail('https://imgur.com/07HYIfq.png')
                msg = `Deu ${pontos} pontos a Lufa-Lufa`

            }else if(['CORVINAL'].includes(house.toUpperCase())){
                pontos_file.ravenclaw = (pontos_file.ravenclaw || 0) + pontos
                casa_pontos_embed.setTitle(`${pontos} pontos para Corvinal`)
                casa_pontos_embed.setDescription(`Professor(a) <@${user.id}> deu ${pontos} pontos a Corvinal`)
                casa_pontos_embed.setThumbnail('https://imgur.com/k25IsbE.png')
                msg = `Deu ${pontos} pontos a Corvinal`
            }

            fs.writeFileSync(`./RPGData/pontos_casas.json`, JSON.stringify(pontos_file));

            const fetchedMessages = await pontosChannel.messages.fetch({ limit: 1 });
            await pontosChannel.bulkDelete(fetchedMessages, true);
            
            await pontosChannel.send({ embeds: [casa_pontos_embed], ephemeral: false });
            const embed = new EmbedBuilder()
                .setColor('#ffad00')
                .setTitle('🏆 Pontos das Casas 🏆')
                .addFields(
                    { name: '<:gryffindor:1333855085033422919> Grifinória <:gryffindor:1333855085033422919>', value: '```'+(pontos_file.gryffindor || 0)+' Pontos```' },
                    { name: '<:slytherin:1333855075176546314> Sonserina <:slytherin:1333855075176546314>', value: '```'+(pontos_file.slytherin || 0)+' Pontos```' },
                    { name: '<:hufflupuff:1333855082202271878> Lufa-Lufa <:hufflupuff:1333855082202271878>', value: '```'+(pontos_file.hufflupuff || 0)+' Pontos```' },
                    { name: '<:ravenclaw:1333855083741446145> Corvinal <:ravenclaw:1333855083741446145>', value: '```'+(pontos_file.ravenclaw || 0)+' Pontos```' }
                )
            ;
            await pontosChannel.send({ embeds: [embed], ephemeral: false });

            return interaction.reply({ content: msg, ephemeral: true });

        }else if(isDM && option === 'rem'){
            const house = interaction.options.getString('casa');
            const pontos = Math.abs(Number(interaction.options.getString('pontos')));
            let casa_pontos_embed = new EmbedBuilder().setColor('#ffad00')
            let msg = ''
            
            if(!['GRIFINORIA','GRIFINÓRIA','SONSERINA', 'LUFALUFA', 'LUFA-LUFA', 'CORVINAL'].includes(house.toUpperCase())){
                return interaction.reply({ content: `Nome de casa errado`, ephemeral: true }); 
            }

            if(['GRIFINORIA','GRIFINÓRIA'].includes(house.toUpperCase())){
                pontos_file.gryffindor = (pontos_file.gryffindor || 0) - pontos
                pontos_file.gryffindor = pontos_file.gryffindor<=0 ? 0 : pontos_file.gryffindor
                casa_pontos_embed.setTitle(`Menos ${pontos} pontos para Grifinória`)
                casa_pontos_embed.setDescription(`Professor(a) <@${user.id}> retirou ${pontos} pontos a Grifinória`)
                casa_pontos_embed.setThumbnail('https://imgur.com/aAlMgXS.png')
                msg = `Retirou ${pontos} pontos a Grifinória`
            
            }else if(['SONSERINA'].includes(house.toUpperCase())){
                pontos_file.slytherin = (pontos_file.slytherin || 0) - pontos
                pontos_file.slytherin = pontos_file.slytherin<=0 ? 0 : pontos_file.slytherin
                casa_pontos_embed.setTitle(`Menos ${pontos} pontos para Sonserina`)
                casa_pontos_embed.setDescription(`Professor(a) <@${user.id}> retirou ${pontos} pontos a Sonserina`)
                casa_pontos_embed.setThumbnail('https://imgur.com/R2Go1RD.png')
                msg = `Retirou ${pontos} pontos a Sonserina`

            }else if(['LUFALUFA', 'LUFA-LUFA'].includes(house.toUpperCase())){
                pontos_file.hufflupuff = (pontos_file.hufflupuff || 0) - pontos
                pontos_file.hufflupuff = pontos_file.hufflupuff<=0 ? 0 : pontos_file.hufflupuff
                casa_pontos_embed.setTitle(`Menos ${pontos} pontos para Lufa-Lufa`)
                casa_pontos_embed.setDescription(`Professor(a) <@${user.id}> retirou ${pontos} pontos a Lufa-Lufa`)
                casa_pontos_embed.setThumbnail('https://imgur.com/07HYIfq.png')
                msg = `Retirou ${pontos} pontos a Lufa-Lufa`

            }else if(['CORVINAL'].includes(house.toUpperCase())){
                pontos_file.ravenclaw = (pontos_file.ravenclaw || 0) - pontos
                pontos_file.ravenclaw = pontos_file.ravenclaw<=0 ? 0 : pontos_file.ravenclaw
                casa_pontos_embed.setTitle(`Menos ${pontos} pontos para Corvinal`)
                casa_pontos_embed.setDescription(`Professor(a) <@${user.id}> retirou ${pontos} pontos a Corvinal`)
                casa_pontos_embed.setThumbnail('https://imgur.com/k25IsbE.png')
                msg = `Retirou ${pontos} pontos a Corvinal`
            }

            fs.writeFileSync(`./RPGData/pontos_casas.json`, JSON.stringify(pontos_file));


            const fetchedMessages = await pontosChannel.messages.fetch({ limit: 1 });
            await pontosChannel.bulkDelete(fetchedMessages, true);

            await pontosChannel.send({ embeds: [casa_pontos_embed], ephemeral: false });
            const embed = new EmbedBuilder()
                .setColor('#ffad00')
                .setTitle('🏆 Pontos das Casas 🏆')
                .addFields(
                    { name: '<:gryffindor:1333855085033422919> Grifinória <:gryffindor:1333855085033422919>', value: '```'+(pontos_file.gryffindor || 0)+' Pontos```' },
                    { name: '<:slytherin:1333855075176546314> Sonserina <:slytherin:1333855075176546314>', value: '```'+(pontos_file.slytherin || 0)+' Pontos```' },
                    { name: '<:hufflupuff:1333855082202271878> Lufa-Lufa <:hufflupuff:1333855082202271878>', value: '```'+(pontos_file.hufflupuff || 0)+' Pontos```' },
                    { name: '<:ravenclaw:1333855083741446145> Corvinal <:ravenclaw:1333855083741446145>', value: '```'+(pontos_file.ravenclaw || 0)+' Pontos```' }
                )
            ;
            await pontosChannel.send({ embeds: [embed], ephemeral: false });

            return interaction.reply({ content: msg, ephemeral: true });

        }

    },
};
