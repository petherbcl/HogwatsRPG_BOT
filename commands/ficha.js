const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');
const { RemoveSpecialCharacters } = require('../utils/utils.js');


const spell_list = JSON.parse(fs.readFileSync(`./RPGData/spell_list.json`, 'utf8'))
const desvantagem_list = JSON.parse(fs.readFileSync(`./RPGData/desvantagem_list.json`, 'utf8'))
const vantagem_list = JSON.parse(fs.readFileSync(`./RPGData/vantagem_list.json`, 'utf8'))

const fichaCampos = {
    name: 'Nome',
    house: 'Casa de Hogwarts',
    year: 'Ano Escolar',
    race: 'Raça',
    age: 'Idade',
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
        .addSubcommand(command => command.setName('pm')
            .setDescription('[DM] Adicionar/Remover PM a player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('pm').setDescription('Pontos de Magia').setRequired(true))
        )
        .addSubcommand(command => command.setName('pe')
            .setDescription('[DM] Adicionar/Remover PE a player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('pe').setDescription('Caracteristica - F , H , R , A , PdF)').setRequired(true))
            .addStringOption(option => option.setName('pontos').setDescription('Pontos').setRequired(true))
        ),
    async execute(interaction, client) {

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

                fichaText = `**Ficha de Personagem de ${member.nickname || member.user.globalName || member.user.username}**
                
**${fichaCampos['name']}:** ${ficha_player['name']}
**${fichaCampos['age']}:** ${ficha_player['age']}
**${fichaCampos['race']}:** ${ficha_player['race']}
**${fichaCampos['house']}:** ${ficha_player['house']}
**${fichaCampos['job']}:** ${ficha_player['job']}
**${fichaCampos['year']}:** ${ficha_player['year']}
**${fichaCampos['F']}:** ${ficha_player['F']}
**${fichaCampos['H']}:** ${ficha_player['H']}
**${fichaCampos['R']}:** ${ficha_player['R']}
**${fichaCampos['A']}:** ${ficha_player['A']}
**${fichaCampos['PdF']}:** ${ficha_player['PdF']}
**${fichaCampos['PV']}:** ${ficha_player['PV']}
**${fichaCampos['PM']}:** ${ficha_player['PM']}
**${fichaCampos['spells']}:** ${ficha_player['spells'].map(spell => spell_list[spell].name).join(' , ')}
**${fichaCampos['vantagens']}:** ${ficha_player['vantagens'].map(vantagem => vantagem_list[vantagem].label).join(' , ')}
**${fichaCampos['desvantagens']}:** ${ficha_player['desvantagens'].map(desvantagem => desvantagem_list[desvantagem].label).join(' , ')}
**${fichaCampos['vantagem_obrigatoria']}:** ${ficha_player['vantagem_obrigatoria']}
**${fichaCampos['appearance']}:**\n ${ficha_player['appearance']}
**${fichaCampos['personality']}:**\n ${ficha_player['personality']}
**${fichaCampos['history']}:**\n ${ficha_player['history']}`;

                filePath = path.join('./tempdata/', `ficha_personagem_${RemoveSpecialCharacters(member.user.username)}_${member.user.id}.txt`);
                fs.writeFileSync(filePath, fichaText);

                attachment = new AttachmentBuilder(filePath);

                await interaction.reply({ files: [attachment], ephemeral: true });

                // Remover o arquivo temporário após o envio
                fs.unlinkSync(filePath);

                break;
            case 'player':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID

                    if (!player_user) {
                        return interaction.reply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    fichaText = `**Ficha de Personagem de ${player_user.nickname || player_user.user.globalName || player_user.user.username}**
                
**${fichaCampos['name']}:** ${ficha_player['name']}
**${fichaCampos['age']}:** ${ficha_player['age']}
**${fichaCampos['race']}:** ${ficha_player['race']}
**${fichaCampos['house']}:** ${ficha_player['house']}
**${fichaCampos['job']}:** ${ficha_player['job']}
**${fichaCampos['year']}:** ${ficha_player['year']}
**${fichaCampos['F']}:** ${ficha_player['F']}
**${fichaCampos['H']}:** ${ficha_player['H']}
**${fichaCampos['R']}:** ${ficha_player['R']}
**${fichaCampos['A']}:** ${ficha_player['A']}
**${fichaCampos['PdF']}:** ${ficha_player['PdF']}
**${fichaCampos['PV']}:** ${ficha_player['PV']}
**${fichaCampos['PM']}:** ${ficha_player['PM']}
**${fichaCampos['spells']}:** ${ficha_player['spells'].map(spell => spell_list[spell].name).join(' , ')}
**${fichaCampos['vantagens']}:** ${ficha_player['vantagens'].map(vantagem => vantagem_list[vantagem].label).join(' , ')}
**${fichaCampos['desvantagens']}:** ${ficha_player['desvantagens'].map(desvantagem => desvantagem_list[desvantagem].label).join(' , ')}
**${fichaCampos['vantagem_obrigatoria']}:** ${ficha_player['vantagem_obrigatoria']}
**${fichaCampos['appearance']}:**\n ${ficha_player['appearance']}
**${fichaCampos['personality']}:**\n ${ficha_player['personality']}
**${fichaCampos['history']}:**\n ${ficha_player['history']}`;

                    filePath = path.join('./tempdata/', `ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.txt`);
                    fs.writeFileSync(filePath, fichaText);

                    attachment = new AttachmentBuilder(filePath);

                    await interaction.reply({ files: [attachment], ephemeral: true });

                    // Remover o arquivo temporário após o envio
                    fs.unlinkSync(filePath);

                }

                break;
            case 'pv':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const pv = interaction.options.getString('pv');

                    if (!player_user) {
                        return interaction.reply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (isNaN(pv)) {
                        return interaction.reply({ content: `PV deverá ser um numero`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_player.PV += pv
                    if (ficha_player.PV <= 0) {
                        ficha_player.PV = 0
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));

                    interaction.reply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\n PV atual é ${ficha_player.PV} `, ephemeral: true });

                }

                break;
            case 'pm':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const pm = Number(interaction.options.getString('pm'));

                    if (!player_user) {
                        return interaction.reply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (isNaN(pm)) {
                        return interaction.reply({ content: `PM deverá ser um numero`, ephemeral: true });
                    }

                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_player.PM += pm
                    if (ficha_player.PM <= 0) {
                        ficha_player.PM = 0
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));

                    interaction.reply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\n PM atual é ${ficha_player.PM} `, ephemeral: true });
                }

                break;
            case 'pe':
                if (isDM) {
                    player = interaction.options.getString('player');
                    playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
                    player_user = guild.members.cache.get(playerID); // Get the member object from the ID
                    const pe = interaction.options.getString('pe').toUpperCase();
                    const pontos = Number(interaction.options.getString('pontos'));

                    if (!player_user) {
                        return interaction.reply({ content: `Player **${player}** não existe.`, ephemeral: true });
                    }

                    if (!['F', 'H', 'R', 'A', 'PDF'].includes(pe)) {
                        return interaction.reply({ content: `Caracteristica **${pe}** não existe.`, ephemeral: true });
                    }

                    if (isNaN(pontos)) {
                        return interaction.reply({ content: `Pontos deverão ser um numero`, ephemeral: true });
                    }


                    player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
                    ficha_player = JSON.parse(player_file)

                    ficha_player[pe] += pontos
                    if (ficha_player[pe] <= 0) {
                        ficha_player[pe] = 0
                    }

                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));

                    interaction.reply({ content: `Player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**\n${fichaCampos[pe]} atual é ${ficha_player[pe]} `, ephemeral: true });
                }

                break
            default:
                interaction.reply({ content: ``, ephemeral: true });
                break;
        }

    },
};
