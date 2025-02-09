const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder,  } = require("discord.js");
const fs = require('fs');
const {RemoveSpecialCharacters} = require('../utils/utils.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('spells')
    .setDescription('Lista os feitiços.')
        .addSubcommand(command => command.setName('list')
            .setDescription('Listar de Feitiços')
        )
        .addSubcommand(command => command.setName('add')
            .setDescription('[DM] Adicionar Feitiço ao Player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('spell').setDescription('Código do feitiço').setRequired(true))
        )
        .addSubcommand(command => command.setName('rem')
            .setDescription('[DM] Remover Feitiço do Player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
            .addStringOption(option => option.setName('spell').setDescription('Código do feitiço').setRequired(true))
        )
    ,
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const file = fs.readFileSync(`./RPGData/spell_list.json`, 'utf8');
        const spell_list = JSON.parse(file)

        const isDM =  interaction.member.roles.cache.find((role) => role.name === 'DM')
        const option = interaction.options.getSubcommand();

        if(option === 'list'){

            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Feitiços').setDescription(Object.entries(spell_list).map(([key, item]) => `* **${key}** - ${item.name} | *${item.pm}* PM | ${item.effect}`).join('\n'));
            return interaction.reply({ embeds: [embed], ephemeral: true });
    
        }else if( (option === 'add' || option === 'rem') && isDM){

            const player = interaction.options.getString('player');
            const playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
            const player_user = guild.members.cache.get(playerID); // Get the member object from the ID

            const spell = interaction.options.getString('spell');

            if (!spell_list[spell]) {
                return interaction.reply({ content: `Feitiço **${spell}** não existe.`, ephemeral: true });
            }

            if (!player_user) {
                return interaction.reply({ content: `Player **${player}** não existe.`, ephemeral: true });
            }

            const player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
            const ficha_player = JSON.parse(player_file)

            if(option === 'add'){

                if(!ficha_player.spells.includes(spell)){
                    ficha_player.spells.push(spell)
                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));
                    return interaction.reply({ content: `Adicionado feitiço **${spell_list[spell].name}** ao player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**.`, ephemeral: true });
                }else{
                    return interaction.reply({ content: `O player **${player_user.nickname || player_user.user.globalName || player_user.user.username}** já possui o feitiço **${spell_list[spell].name}**.`, ephemeral: true });
                }

            }else if(option === 'rem'){
                if(ficha_player.spells.includes(spell)){
                    ficha_player.spells = ficha_player.spells.filter(s => s !== spell);
                    fs.writeFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, JSON.stringify(ficha_player));
                    return interaction.reply({ content: `Removido feitiço **${spell_list[spell].name}** do player **${player_user.nickname || player_user.user.globalName || player_user.user.username}**.`, ephemeral: true });
                }else{
                    return interaction.reply({ content: `O player **${player_user.nickname || player_user.user.globalName || player_user.user.username}** não possui o feitiço **${spell_list[spell].name}**.`, ephemeral: true });
                }
            }

        }

    },
};
