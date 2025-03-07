const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

const CHANNEL_ID = '1347646389861089390'; // Substitui pelo ID do canal
const STORAGE_FILE = './RPGData/relogio.json';

function loadClock() {
    if (fs.existsSync(STORAGE_FILE)) {
        return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
    }
    return { year: 2025, month: 1, day: 1, hour: 0, minute: 0 }; // Data inicial
}

// Função para guardar a hora do relógio
function saveClock(clock) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(clock, null, 2));
}

// Função para avançar o tempo
function advanceTime(clock) {
    clock.minute += 3; // Cada minuto real = 3 minutos no relógio
    if (clock.minute >= 60) {
        clock.minute = 0;
        clock.hour++;
    }
    if (clock.hour >= 24) {
        clock.hour = 0;
        clock.day++;
    }
    // Ajustar meses (simplificado, sem anos bissextos)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (clock.day > daysInMonth[clock.month - 1]) {
        clock.day = 1;
        clock.month++;
    }
    if (clock.month > 12) {
        clock.month = 1;
        clock.year++;
    }
    return clock;
}

// Função para atualizar a mensagem do relógio
async function updateClockMessage(channel, client) {
    let clock = loadClock();
    clock = advanceTime(clock);
    saveClock(clock);

    const timeString = `🕒 ${clock.hour.toString().padStart(2, '0')}:${clock.minute.toString().padStart(2, '0')}`;
    
    const messages = await channel.messages.fetch({ limit: 10 });
    const botMessage = messages.find(msg => msg.author.id === client.user.id);

    const embed = new EmbedBuilder().setColor('#ffad00')
        .setTitle('Relógio de Hogwarts')
        .setDescription(`São atualmente: \n# ${'`'+timeString+'`'}`)
        .setImage('https://imgur.com/wn6CkLr.png');
    
    if (botMessage) {
        botMessage.edit({embeds: [embed]});
    } else {
        channel.send({embeds: [embed]});
    }
}

async function startClock(client) {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) return console.error('Canal não encontrado!');
    setInterval(() => updateClockMessage(channel, client), 60 * 1000); // Atualiza a cada minuto real
}



module.exports = {
    startClock,
};
