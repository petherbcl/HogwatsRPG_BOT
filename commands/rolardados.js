const { SlashCommandBuilder } = require('@discordjs/builders');
const { log } = require("../utils/utils.js");

function rollDice(diceNotation) {
    const [numDice, numSides] = diceNotation.split('D').map(Number);
    const results = [];
    let total = 0;

    for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * numSides) + 1;
        results.push(roll);
        total += roll;
    }

    return { results, total };
}

function rollMultipleDice(args) {
    const allResults = args.map(arg => rollDice(arg));
    const summary = allResults.map((result, index) => {
        return `Rolagem ${index + 1} (${args[index]}): ${result.results.join(', ')} (Total: ${result.total})`;
    }).join('\n');

    const grandTotal = allResults.reduce((sum, result) => sum + result.total, 0);

    return `${summary}\n\nSomatório de todas as rolagens: ${grandTotal}`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolardados')
        .setDescription('Simula a rolagem de dados.')
        .addStringOption(option => option.setName('dados').setDescription('Notação dos dados para rolar (ex: 3D20 2D6)').setRequired(true)),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        const channel = interaction.channel;

        const diceNotation = interaction.options.getString('dados').toUpperCase();
        const args = diceNotation.split(' ');

        const result = rollMultipleDice(args);

        await interaction.reply(result);

        log(guild,`<@${user.id}> usou comando ${"`/rolardados`"} e rolou ${diceNotation}. Resultado: ${result}`);
    },
};
