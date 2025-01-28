const { SlashCommandBuilder } = require('@discordjs/builders');

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
    async execute(interaction) {
        const diceNotation = interaction.options.getString('dados');
        const args = diceNotation.split(' ');

        const result = rollMultipleDice(args);

        await interaction.reply(result);
    },
};
