const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, MessageFlags } = require("discord.js");

module.exports = {
	customID: 'newArrival',
	async execute(interaction, client) {
        client.isMoving[interaction.user.id] = true

        const guild = interaction.member.guild
        const member = interaction.member

        if (!member.voice.channel) {
            client.isMoving[interaction.user.id] = false
            await interaction.reply({ content: `⚠️ DEVERÁ ESTÁR LIGADO EM UM CANAL DE VOZ ⚠️`, flags: MessageFlags.Ephemeral })
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