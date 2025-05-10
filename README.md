# Hogwarts RPG Discord Bot

Este é um bot de Discord desenvolvido para gerenciar um RPG baseado no universo de Harry Potter. Ele inclui funcionalidades como criação de fichas de personagens, gerenciamento de inventários, compra de itens, e muito mais.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:


## Funcionalidades

- **Criação de Fichas**: Comando `/criarficha` para criar fichas de personagens com atributos, vantagens, desvantagens, e mais.
- **Gerenciamento de Inventário**: Adicionar, remover e listar itens no inventário dos jogadores.
- **Sistema de Pontos**: Adicionar ou remover pontos das casas de Hogwarts.
- **Compras no Beco Diagonal**: Comprar itens como varinhas, roupas e animais mágicos.
- **Relógio de Hogwarts**: Atualização automática do horário no servidor.
- **Logs**: Registro de ações importantes no canal de logs.

## Pré-requisitos

- Node.js (versão 16 ou superior)
- Um bot configurado no Discord Developer Portal
- Dependências listadas no `package.json`

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/hogwarts-rpg-bot.git
   cd hogwarts-rpg-bot
   ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure o arquivo config.json com as informações:
    ```bash
    {
    "token": "SEU_TOKEN_DO_BOT",
    "clientId": "SEU_CLIENT_ID",
    "guildId": "SEU_GUILD_ID"
    }
    ```

4. Inicie o bot:
   ```bash
   node index.js
   ```


## Comandos Principais

```/criarficha```

Inicia o processo de criação de uma ficha de personagem.

```/ficha```

Gerencia as fichas de personagens. Subcomandos disponíveis:

```check```: Visualiza sua ficha.

```player```: Visualiza a ficha de outro jogador (apenas para DMs).

```pv, pm, pe```: Gerencia atributos de vida, magia e experiência.


```/pontos```
Gerencia os pontos das casas de Hogwarts. 

Subcomandos disponíveis:

```check```: Mostra os pontos atuais.

```add```: Adiciona pontos a uma casa.

```rem```: Remove pontos de uma casa.


```/item```
Gerencia os itens dos jogadores. Subcomandos disponíveis:

```list```: Lista os itens disponíveis.

```add```: Adiciona itens ao inventário de um jogador.

```rem```: Remove itens do inventário de um jogador.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.
