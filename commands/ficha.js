const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');
const { RemoveSpecialCharacters, FichaToPDF, createFichaEmbed } = require('../utils/utils.js');


const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))
const desvantagem_list = JSON.parse(fs.readFileSync(`./RPGData/desvantagem_list.json`, 'utf8'))
const vantagem_list = JSON.parse(fs.readFileSync(`./RPGData/vantagem_list.json`, 'utf8'))
const vantagem_desvantagem_by_year = JSON.parse(fs.readFileSync(`./RPGData/vantagem_desvantagem_by_year.json`, 'utf8'))

const fichaCampos = {
    name: 'Nome',
    house: 'Casa de Hogwarts',
    year: 'Ano Escolar',
    race: 'Raça',
    age: 'Idade',
    job: 'Cargo',
    F: 'Força (F)',
    H: 'Habilidade (H)',
    R: 'Resistência (R)',
    A: 'Armadura (A)',
    PdF: 'Poder de Fogo (PdF)',
    PV: 'Pontos de Vida',
    PM: 'Pontos de Magia',
    PE: 'Pontos de Experiência',

    spells: 'Feitiços Conhecidos',
    vantagens: 'Vantagens',
    desvantagens: 'Desvantagens',
    vantagem_obrigatoria: 'Vantagem Obrigatória',

    appearance: 'Aparência',
    personality: 'Personalidade',
    history: 'História/Antecedentes',
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ficha')
        .setDescription('Ficha Personagem')
        .addSubcommand(command => command.setName('check')
            .setDescription('Ver Ficha do seu Personagem')
        )
        .addSubcommand(command => command.setName('player')
            .setDescription('[DM] Ver Ficha do Personagem de player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
        )
        .addSubcommand(command => command.setName('pv')
            .setDescription('[DM] Adicionar/Remover PV a player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('pv').setDescription('Pontos de Vida').setRequired(true))
        )
        .addSubcommand(command => command.setName('pvmax')
            .setDescription('[DM] Adicionar/Remover Máximo PV a player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('pvmax').setDescription('Pontos de Vida Máximo').setRequired(true))
        )
        .addSubcommand(command => command.setName('pm')
            .setDescription('[DM] Adicionar/Remover PM a player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('pm').setDescription('Pontos de Magia').setRequired(true))
        )
        .addSubcommand(command => command.setName('pmmax')
            .setDescription('[DM] Adicionar/Remover Máximo PM a player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('pmmax').setDescription('Pontos de Magia Máximo').setRequired(true))
        )
        .addSubcommand(command => command.setName('pe')
            .setDescription('[DM] Adicionar/Remover PE ao player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('pontos').setDescription('Pontos').setRequired(true))
        )
        .addSubcommand(command => command.setName('vantagem')
            .setDescription('[DM] Alterar lista de Vantagens de player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('vantagens').setDescription('Lista de vantagens (separado por virgula)').setRequired(true))
        )
        .addSubcommand(command => command.setName('desvantagem')
            .setDescription('[DM] Alterar lista de Desvantagens de player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('desvantagens').setDescription('Lista de desvantagens (separado por virgula)').setRequired(true))
        )
        .addSubcommand(command => command.setName('caracteristicas')
            .setDescription('[DM] Alterar Caracteristicas de player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('caracteristica').setDescription('Caracteristica a alterar (F, H, R, A, PdF)').setRequired(true))
            .addStringOption(option => option.setName('valor').setDescription('Novo valor da caracteristica').setRequired(true))
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const isDM = member.roles.cache.find((role) => role.name === 'DM')
        const option = interaction.options.getSubcommand();

        let player, playerID, player_user, player_file, ficha_player, fichaText, attachment, filePath

        switch (option) {
            case 'check':
                player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(user.username)}_${user.id}.json`, 'utf8');
                ficha_player = JSON.parse(player_file)

                await interaction.editReply({ embeds: createFichaEmbed(user.username, user.id), ephemeral: true });

                interaction.followUp({ content: 'Gerando ficha em PDF. Poderá demorar alguns segundos', ephemeral: true });


                await FichaToPDF(member.user.username, member.user.id)
                const filePathDoc = path.join('./tempdata/', `ficha_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.docx`);
                const filePathPdf = path.join('./tempdata/', `ficha_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.pdf`);

                attachment = new AttachmentBuilder(filePathPdf);
                interaction.followUp({ files: [attachment], ephemeral: true });

                await new Promise(resolve => setTimeout(resolve, 5000));

                fs.unlinkSync(filePathDoc);
                fs.unlinkSync(filePathPdf);

                break;
            case 'player':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    await interaction.editReply({ embeds: createFichaEmbed(player_user.user.username, player_user.user.id), ephemeral: true });

                    interaction.followUp({ content: 'Gerando ficha em PDF. Poderá demorar alguns segundos', ephemeral: true });

                    await FichaToPDF(player_user.user.username, player_user.user.id)
                    const filePathDoc = path.join('./tempdata/', `ficha_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.docx`);
                    const filePathPdf = path.join('./tempdata/', `ficha_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.pdf`);

                    attachment = new AttachmentBuilder(filePathPdf);
                    interaction.followUp({ files: [attachment], ephemeral: true });

                    await new Promise(resolve => setTimeout(resolve, 5000));

                    fs.unlinkSync(filePathDoc);
                    fs.unlinkSync(filePathPdf);
                }

                break;
            case 'pv':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const pv = Number(interaction.options.getString('pv'))

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (isNaN(pv)) {
                        return interaction.editReply({ content: `PV deverá ser um numero`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_player.PV += pv
                    if (ficha_player.PV <= 0) {
                        ficha_player.PV = 0
                    } else if (ficha_player.PV > ficha_player.PVMax) {
                        ficha_player.PV = ficha_player.PVMax
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));

                    interaction.editReply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\n PV atual é ${ficha_player.PV} `, ephemeral: true });

                }

                break;
            case 'pvmax':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const pvmax = Number(interaction.options.getString('pvmax'));

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (isNaN(pvmax)) {
                        return interaction.editReply({ content: `PVMax deverá ser um numero`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_player.PVMax += pvmax
                    if (ficha_player.PVMax <= 0) {
                        ficha_player.PVMax = 0
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));

                    interaction.editReply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\n PVMax atual é ${ficha_player.PVMax} `, ephemeral: true });

                }

                break;
            case 'pm':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const pm = Number(interaction.options.getString('pm'));

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (isNaN(pm)) {
                        return interaction.editReply({ content: `PM deverá ser um numero`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_player.PM += pm
                    if (ficha_player.PM <= 0) {
                        ficha_player.PM = 0
                    } else if (ficha_player.PM > ficha_player.PMMax) {
                        ficha_player.PM = ficha_player.PMMax
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));

                    interaction.editReply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\n PM atual é ${ficha_player.PM} `, ephemeral: true });
                }

                break;
            case 'pmmax':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const pmmax = Number(interaction.options.getString('pmmax'));

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (isNaN(pmmax)) {
                        return interaction.editReply({ content: `PM deverá ser um numero`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_player.PMMax += pmmax
                    if (ficha_player.PMMax <= 0) {
                        ficha_player.PMMax = 0
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));

                    interaction.editReply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\n PMMax atual é ${ficha_player.PMMax} `, ephemeral: true });
                }

                break;
            case 'pe':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const pontos = Number(interaction.options.getString('pontos'));

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (isNaN(pontos)) {
                        return interaction.editReply({ content: `Pontos deverão ser um numero`, ephemeral: true });
                    }


                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_player['PE'] += pontos
                    if (ficha_player['PE'] <= 0) {
                        ficha_player['PE'] = 0
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));

                    interaction.editReply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\nPontos de Experiência atual é ${ficha_player['PE']} `, ephemeral: true });
                }

                break
            case 'vantagem':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const vantagens = interaction.options.getString('vantagens');

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    const vantagenslist = vantagens.split(',').map(v => v.trim());
                    if (vantagenslist.length > 3) {
                        return interaction.editReply({ content: `Escolha no máximo até 3 vantagens.`, ephemeral: true });
                    }
                    for (let i = 0; i < vantagenslist.length; i++) {
                        const vantagem = vantagenslist[i]
                        if (!Object.values(vantagem_list).map(v => v.label.toUpperCase()).includes(vantagem.toUpperCase())) {
                            return interaction.editReply({ content: `${vantagem} não existe na lista`, ephemeral: true });
                        }
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_personagem.vantagens = []
                    vantagenslist.forEach(vantagem => {
                        const id = Object.keys(vantagem_list).find(key => vantagem_list[key].label.toUpperCase() === vantagem.toUpperCase());
                        ficha_personagem.vantagens.push(id)
                    })

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));
                    interaction.editReply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\nLista de Vantagens atual é ${vantagens} `, ephemeral: true });
                }

                break
            case 'devantagem':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const devantagens = interaction.options.getString('devantagens');

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    const devantagenslist = devantagens.split(',').map(v => v.trim());
                    if (devantagenslist.length > 3) {
                        return interaction.editReply({ content: `Escolha no máximo até 3 desvantagens.`, ephemeral: true });
                    }
                    for (let i = 0; i < devantagenslist.length; i++) {
                        const desvantagem = devantagenslist[i]
                        if (!Object.values(desvantagem_list).map(v => v.label.toUpperCase()).includes(desvantagem.toUpperCase())) {
                            return interaction.editReply({ content: `${desvantagem} não existe na lista`, ephemeral: true });
                        }
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_personagem.desvantagens = []
                    devantagenslist.forEach(desvantagem => {
                        const id = Object.keys(vantagem_list).find(key => desvantagem_list[key].label.toUpperCase() === desvantagem.toUpperCase());
                        ficha_personagem.desvantagens.push(id)
                    })

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));
                    interaction.editReply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\nLista de Desvantagens atual é ${devantagens} `, ephemeral: true });
                }

                break
            case 'caracteristicas':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    let caracteristica = interaction.options.getString('caracteristica').toUpperCase();
                    const valor = Number(interaction.options.getString('valor'));

                    if (!player_user) {
                        return interaction.editReply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (!['F', 'H', 'A', 'R', 'PDF'].includes(caracteristica)) {
                        return interaction.editReply({ content: `Caracteristica não existe`, ephemeral: true });
                    }

                    if (isNaN(valor)) {
                        return interaction.editReply({ content: `Valor deverá ser um numero`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    if (caracteristica === 'PDF') {
                        caracteristica = 'PdF'
                    }

                    ficha_player[caracteristica] = valor

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));
                    interaction.editReply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\n${caracteristica} atual é ${valor} `, ephemeral: true });
                }

                break
            default:
                interaction.editReply({ content: ``, ephemeral: true });
                break;
        }

    },
};
