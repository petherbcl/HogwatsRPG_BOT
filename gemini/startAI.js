const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require("@google/generative-ai");
const { GoogleAICacheManager, GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs');

// client.chatSessionUser = {}
const cfg = require('../config.json');


const MODEL_NAME = "gemini-2.0-flash-exp" //"gemini-pro";
const genAI = new GoogleGenerativeAI(cfg.GEMINI_API_KEY);
const cacheManager = new GoogleAICacheManager(cfg.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(cfg.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const startBotInfo = `Tu fazes parte do universo de Harry Potter. Devez usar todas as infomações oficiais dos livros e filmes para responder as perguntas bem como todo o material oficial da Warner Bros.
Como AI deves sempre responder como se fosses o maior feiticeiro do universo como todo o conhecimento existente. As tuas respostas devem sempre mostrar o teu conhecimento e sabedoria.
O teu nome é Gemini, o maior feiticeiro do universo. Todas as tuas respontas devem comecar com um emoji de feiticeiro 🧙‍♂️.
A partir desde momento todas as resposta deverão ser relacionadas apenas o sistems de RPG 3D&T e o universo de Harry Potter. 
Qualquer outra pergunta fora do tema deve ser respondido com: Estou sobre um feitiço de esquecimento.`

async function StartAI(client, userId) {
    if (!client.chatSessionUser[userId]) {

        if (!fs.existsSync(`./gemini/cacheData/${userId}.json`)) {
            fs.writeFileSync(`./gemini/cacheData/${userId}.json`,
                JSON.stringify([{
                    "role": "user",
                    "parts": [
                        {
                            "text": startBotInfo
                        }
                    ]}]), (err) => {
                    if (err) {
                        console.error('Erro ao criar o arquivo:', err);
                    } else {
                        console.log('Arquivo criado com sucesso!');
                    }
                });
        }

        const file = fs.readFileSync(`./gemini/cacheData/${userId}.json`, 'utf8');
        const historyContent = JSON.parse(file)


        const chatSession = model.startChat({
            generationConfig,
            history: historyContent,
        });

        client.chatSessionUser[userId] = chatSession


    }
}

async function AskQuestion(client, userId, question) {
    if (client.chatSessionUser[userId]) {
        const chatSession = client.chatSessionUser[userId]
        const result = await chatSession.sendMessage(question);

        SaveHistory(userId, question, result.response.text())

        return result.response.text()
    }
}

function SaveHistory(userId, prompt, response) {
    const file = fs.readFileSync(`./gemini/cacheData/${userId}.json`, 'utf8');
    const content = JSON.parse(file)

    content.push({
        "role": "user",
        "parts": [
            {
                "text": prompt
            }
        ]
    },
        {
            "role": "model",
            "parts": [
                {
                    "text": response
                }
            ]
        }
    )

    fs.writeFileSync(`./gemini/cacheData/${userId}.json`, JSON.stringify(content));

}

// Export the functions and variables
module.exports = {
    StartAI,
    AskQuestion,
};
