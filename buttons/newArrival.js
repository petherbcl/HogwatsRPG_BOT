const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");

module.exports = {
	customID: 'newArrival',
	async execute(interaction, client) {

        // const botaoGrifinoria = new ButtonBuilder()
        //     .setCustomId('grifinoria_choose')
        //     .setLabel('Grifinória')
        //     .setEmoji('🦁') // Emoji do leão
        //     .setStyle(ButtonStyle.Primary);

        // const botaoSonserina = new ButtonBuilder()
        //     .setCustomId('sonserina_choose')
        //     .setLabel('Sonserina')
        //     .setEmoji('🐍') // Emoji da cobra
        //     .setStyle(ButtonStyle.Success);

        // const botaoCorvinal = new ButtonBuilder()
        //     .setCustomId('corvinal_choose')
        //     .setLabel('Corvinal')
        //     .setEmoji('🦅') // Emoji da águia
        //     .setStyle(ButtonStyle.Secondary);

        // const botaoLufaLufa = new ButtonBuilder()
        //     .setCustomId('lufalufa_choose')
        //     .setLabel('Lufa-Lufa')
        //     .setEmoji('🦡') // Emoji do texugo
        //     .setStyle(ButtonStyle.Primary);

        // // Organizar os botões em uma linha
        // const row = new ActionRowBuilder().addComponents(
        //     botaoGrifinoria,
        //     botaoSonserina,
        //     botaoCorvinal,
        //     botaoLufaLufa
        // );

        // const embed = new EmbedBuilder().setColor('#ffad00').setTitle('🎓 Bem Vindo a Hogwarts!').setDescription('Escolha a sua casa ')

        // await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        client.isMoving[interaction.user.id] = true

        const guild = interaction.member.guild
        const member = interaction.member

        if (!member.voice.channel) {
            client.isMoving[interaction.user.id] = false
            await interaction.reply({ content: `⚠️ DEVERÁ ESTÁR LIGADO EM UM CANAL DE VOZ ⚠️`, ephemeral: true })
            return
        }

        const roleAluno= guild.roles.cache.find((role) => role.name === "Aluno");
        const salaChegada = guild.roles.cache.find((role) => role.name === client.roomRoles["cabana-dos-barcos"]);

        await interaction.member.roles
            .add(roleAluno)
            .catch((err) => console.error(`Erro ao atribuir role: ${err}`));

            await interaction.member.roles
            .add(salaChegada)
            .catch((err) => console.error(`Erro ao atribuir role: ${err}`));

        await interaction.member.roles
            .remove(guild.roles.cache.find((role) => role.name === client.roomRoles["expresso-de-hogwarts"]))
            .then(() => {
                console.error(`removed ${client.roomRoles[member.voice.channel.name]}`)
                client.isMoving[interaction.user.id] = false
            })
            .catch((err) => {
                console.error(`Erro ao remover role: ${err}`)
                client.isMoving[interaction.user.id] = false
            });

        const channel = guild.channels.cache.find((c) => c.name === "cabana-dos-barcos");
        await interaction.member.voice.setChannel(channel)
            .then(() => console.log(`Usuário ${interaction.member.user.tag} movido para ${channel.name}`))
            .catch(error => {
                console.error(error);
            });

        await interaction.deferUpdate();
	}
}