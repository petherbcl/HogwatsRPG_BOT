const { SlashCommandBuilder } = require('discord.js');

const questions = {
    name: {lable: 'Nome:', type: 'string', question: true},
    house: {lable: 'Casa de Hogwarts: (Grifinória, Sonserina, Corvinal, Lufa-Lufa)?', type: 'string', question: true},
    year: {lable: 'Ano Escolar: (1, 2, 3, 4, 5, 6, 7)?', type: 'number', question: true},
    race: {lable: 'Raça: (Humano, meio-veela, lobisomem, mestiço, etc.)', type: 'string', question: true},
    age: {lable: 'Idade:', type: 'number', question: true},
    appearance: {lable: 'Aparência:', type: 'string', question: true},
    personality: {lable: 'Personalidade:', type: 'string', question: true},
    history: {lable: 'História/Antecedentes:', type: 'string', question: true},
    features: {lable: 'Características\n*Distribua  5 pontos entre as características*', type: 'string', question: false},
    forca: {lable: 'Força (F):', type: 'number', question: true},
    habilidade: {lable: 'Habilidade (H):', type: 'number', question: true},
    resistencia: {lable: 'Resistência (R):', type: 'number', question: true},
    armadura: {lable: 'Armadura (A):', type: 'number', question: true},
    poderdefogo: {lable: 'Poder de Fogo (PdF):', type: 'number', question: true},
    vantagens: {lable: 'Vantagens:\n*Escolha até 2 ou ajuste pelo mestre*\n***Separe as vantagens por virgula***\nPode consultar lista em <#1334975689257914480>', type: 'string', question: true},
    desvantagens: {lable: 'Desvantagens:\n*Escolha 1 ou ajuste pelo mestre\n\nPode consultar lista em <#1334975689257914480>*', type: 'string', question: true},
    vantagem_obrigatoria: {lable: 'Vantagem Obrigatória.\nEscolha uma das seguintes:\n* Magia Branca\n* Magia Elemental\n* Magia Negra', type: 'string', question: true},
}

function removeSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
}

function answerValidator(index, answer){
    const key = Object.keys(questions)[index];
    const question = Object.values(questions)[index];

    if(question.type === 'number'){

        if(isNaN(answer)){
            return 'Por favor, responda com um número.';
        }

        if(key === 'year' && (answer < 1 || answer > 7)){
            return 'Por favor, responda com um número entre 1 e 7.';
        }
    }

    if(key === 'house' && !['Grifinória', 'Sonserina', 'Corvinal', 'Lufa-Lufa'].includes(answer)){
        return 'Por favor, responda com uma das casas de Hogwarts: Grifinória, Sonserina, Corvinal, Lufa-Lufa.';
    }

    if(key === 'vantagem_obrigatoria' && !['Magia Branca', 'Magia Elemental', 'Magia Negra'].includes(answer)){
        return 'Por favor, responda com uma das Vantagens Obrigatórias:\n* Magia Branca\n* Magia Elemental\n* Magia Negra.';
    }

    if(key === 'vantagens'){
        const vantagens = answer.split(',').map( v => v.trim());
        if(vantagens.length > 2){
            return 'Por favor, responda com até 2 vantagens.';
        }
    }

    if(key === 'desvantagens'){
        const vantagens = answer.split(',').map( v => v.trim());
        if(vantagens.length > 1){
            return 'Por favor, responda com até 2 vantagens.';
        }
    }

    return null;
}

module.exports = {
    dm: true,
    data: new SlashCommandBuilder()
        .setName('criarficha')
        .setDescription('Inicia ficha de personagem.'),
    async execute(interaction) {

        const guild = interaction.member.guild
        const member = guild.members.cache.get(interaction.user.id);
        const channel = interaction.channel;

        // if(channel.name !== `carta-de-${removeSpecialCharacters(member.user.username)}-${member.user.id}`){
        //     return interaction.reply({ content: `Esse comando só pode ser usado no canal **carta-de-${removeSpecialCharacters(member.user.username)}-${member.user.id}**`, ephemeral: true });
        // }

        const filter = response => response.author.id === interaction.user.id;
        let currentQuestion = 0;
        let respostas = {}
        Object.keys(questions).filter( q => q.question).forEach( q => respostas[q] = null)

        const askQuestion = async () => {
            if (currentQuestion < Object.values(questions).length) {

                await interaction.followUp(Object.values(questions)[currentQuestion].lable);

                if(Object.values(questions)[currentQuestion].question){
                    const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
                    let answer = collected.first().content;
                    answer = Object.values(questions)[currentQuestion].type === 'number' ? parseInt(answer) : answer;

                    if(answerValidator(currentQuestion, answer)){
                        await interaction.followUp(answerValidator(currentQuestion, answer));
                        return askQuestion();
                    }

                    respostas[Object.keys(questions)[currentQuestion]] = answer

                    console.log(`Pergunta: ${Object.values(questions)[currentQuestion].lable}, Resposta: ${answer}`);
                }
                currentQuestion++;
                askQuestion();
            } else {
                if(respostas.forca + respostas.habilidade + respostas.resistencia + respostas.armadura + respostas.poderdefogo > 5){
                    await interaction.followUp('Pontos distribuidos entre as características superiores ao permitido. Terá que refazer a ficha.');
                }else{
                    interaction.followUp('Ficha de personagem concluído!');
                    interaction.followUp(Object.entries(respostas).map( ([key, value]) => `${key}: ${value}`).join('\n'));
                }

                // console.log(respostas)
            }
        };

        await interaction.reply('Iniciando Ficha de personagem');
        askQuestion();



    },
};