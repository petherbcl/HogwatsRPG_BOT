const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const fs = require('fs');
const {RemoveSpecialCharacters, log} = require('../utils/utils.js');

const pericias_list = JSON.parse(fs.readFileSync(`./RPGData/pericias.json`, 'utf8'))
const pericias_by_year = JSON.parse(fs.readFileSync(`./RPGData/pericias_by_year.json`, 'utf8'))

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pericias')
    .setDescription('Lista os Perícias.')
        .addSubcommand(command => command.setName('list')
            .setDescription('Lista os Perícias')
        )
        .addSubcommand(command => command.setName('player')
            .setDescription('[DM] Lista os Perícias de Player')
            .addStringOption(option => option.setName('player').setDescription('Marque o player. EX: @fulano').setRequired(true))
        )
    ,
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true }).catch( () => {} );

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const isDM =  interaction.member.roles.cache.find((role) => role.name === 'DM')
        const option = interaction.options.getSubcommand();

        if(option === 'list'){
            const pericias = Object.keys(pericias_list).sort( (a,b) => pericias_list[a].name.localeCompare(pericias_list[b].name) )
            const selectNeed = Math.ceil(pericias.length/25)
            
            const rowList = []; 

            for(let i = 0; i < selectNeed; i++){
                const row = new ActionRowBuilder()
                const selectmenu = new StringSelectMenuBuilder()
                    .setCustomId(`selectpericia_${i}`)
                    .setPlaceholder('Selecione uma Perícia')
                
                const pericias_slice = pericias.slice(i*25, (i+1)*25)
                for(const pericia of pericias_slice){
                    selectmenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(pericias_list[pericia].name).setValue(pericia))
                }
                row.addComponents(selectmenu)
                rowList.push(row)
            }

            const embed = new EmbedBuilder().setColor('#ffad00').setTitle('Lista de Perícias').setDescription('Selecione uma perícia para mais informações.')

            await interaction.editReply({embeds: [embed], components: rowList, flags: MessageFlags.Ephemeral});

            log(guild,`<@${user.id}> usou comando ${"`/pericias list`"}`);

            return
        }else if(option === 'player' && isDM){
            const player = interaction.options.getString('player');
            const playerID = player.match(/\d+/)[0]; // Get the user ID from the mention
            const player_user = guild.members.cache.get(playerID); // Get the member object from the ID

            if (!player_user) {
                return interaction.editReply({ content: `Player **${player}** não existe.`, flags: MessageFlags.Ephemeral });
            }

            const player_file = fs.readFileSync(`./RPGData/players/ficha_personagem/ficha_personagem_${RemoveSpecialCharacters(player_user.user.username)}_${player_user.user.id}.json`, 'utf8');
            const ficha_player = JSON.parse(player_file)

            const pericias_player = ficha_player.pericias.map(p => pericias_list[p].name).join(', ')

            const embed = new EmbedBuilder().setColor('#ffad00').setTitle(`Perícias de ${player_user.nickname || player_user.user.globalName || player_user.user.username}`).setDescription(pericias_player)

            await interaction.editReply({embeds: [embed], flags: MessageFlags.Ephemeral});

            log(guild,`<@${user.id}> usou comando ${"`/pericias player`"} para consultar as perícias de <@${player_user.user.id}>.`);

            return
        }

    },
};
