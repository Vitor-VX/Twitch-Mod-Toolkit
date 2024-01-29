# Módulo-Twitch-Moderation
Biblioteca para Chat Bot da Twitch: inclui funções para banir, desbanir, bloquear palavras e muito mais;

### Antes de começar, é importante ter em mente alguns pontos:
- Este módulo não inclui um chat bot completo por si só. Você precisará utilizar outras bibliotecas para desenvolver o bot de chat. Recomendamos a biblioteca tmi.js, que também é usada em outro projeto. Se você já tem experiência em criar bots para a Twitch, sabe que a Twitch agora exige que solicitações sejam feitas para usar determinadas funcionalidades no bot de chat.

- Este módulo se concentra nas funcionalidades de moderação, como banir, desbanir, bloquear palavras, entre outras. Ele fornece as ferramentas necessárias para interagir com a plataforma da Twitch e implementar essas funcionalidades em seu chat bot.

# Instalação:
- A instalação fica na pasta `TutorialTokenTwitch`, lá ensino do zero como criar sua aplicação e pegar seu token.

# Importante: 
- Para você conseguir utilizar todas as funções dessa biblitoeca é necessário esse scope: 
```
scope=chat:read+chat:edit+channel:moderate+whispers:read+whispers:edit+channel_editor+moderator:manage:banned_users+moderation:read+moderator:manage:banned_users+moderator:manage:chat_messages+moderator:read:chatters+moderator:manage:blocked_terms+moderator:manage:chat_messages+moderator:manage:chat_settings+user:manage:whispers+channel:manage:broadcast
```

# Próxima Etapa: Como vou utilizar esse Módulo agora?
- Antes de começar a usar as funcionalidades de moderação do módulo, você precisa configurar um código base para se conectar ao chat do canal específico e receber eventos de mensagens do chat. Siga os passos abaixo:

1. Caso ainda não tenha instalado a biblioteca utilize:
```
npm i twitch-moderation-tools --g
```

3. Utilize uma biblioteca apropriada para interagir com o chat da Twitch. Recomendamos a biblioteca tmi.js, que é amplamente utilizada para esse propósito.

4. Instale a biblioteca tmi.js em seu projeto utilizando o npm (Node Package Manager):
   ``` npm i tmi.js ```

5. Agora faremos o código base, no exemplo abaixo utilizamos a função para banir um usuário no chat:
```javascript
// Adicione as informações conforme a instalação anterior
const SEU_TOKEN_TWITCH = 'SEU_TOKEN_AQUI'
const SEU_CLIENT_ID = 'SEU_CLIENT_ID_AQUI'

// Importação da biblioteca tmi.js
const twitch = require('tmi.js').Client({
    options: { debug: true },
    identity: {
        username: 'NOME_DO_SEU_BOT',
        password: SEU_TOKEN_TWITCH
    },
    channels: ['CANAL_QUE_VOCE_VAI_ADICIONAR_O_BOT']
})

// Importação do MóduloTwitchModeration -> npm i twitch-moderation-tools --g
const ModuloTwitchModeration = require('twitch-moderation-tools')

// Evento principal para receber mensagens do chat e aplicar moderação
twitch.on('message', (canalTwitch, tags, message, selfBot) => {
    canalTwitch = canalTwitch.replace('#', '')
    // Instanciando o módulo ModuloTwitchModeration
    const twitchModeration = new ModuloTwitchModeration(SEU_TOKEN_TWITCH, SEU_CLIENT_ID)

    // Nome de usuário do seu bot (por exemplo: joxsbot)
    const NOME_DE_USUARIO_DO_SEU_BOT = 'NOME_CORRETO_DO_USER_DO_SEU_BOT_NA_TWITCH'
    const USER_PARA_BANIR = 'USER_QUE_VOCE_DESEJA_BANIR'
    
    // Verificando se a mensagem começa com "!ban"
    if (message.toLowerCase().startsWith('!ban')) {
        // Chamando o método BanUser do módulo MóduloTwitchModeration
        twitchModeration.BanUser(canalTwitch, `${NOME_DE_USUARIO_DO_SEU_BOT}`, `${USER_PARA_BANIR}`)
    }
})

// Conectando o bot ao chat da Twitch
twitch.connect().then(() => console.log('Bot conectado ao chat da Twitch!'))
```
# Funções

## GetInfoUser(...nomeUserTwitch)
- Obtém as IDs dos usuários do Twitch com base nos nomes de usuário fornecidos. Creio que você não irá utilizar, mais é uma otima ferramenta.

```javascript
twitchModeration.GetInfoUser('nomeUsuario1', 'nomeUsuario2');
```

## BanUser(channel, moderatorBot, userBanned, motivoBan)
- Bane um usuário do chat.
```javascript
twitchModeration.BanUser('canal', 'bot', 'usuarioBanned', 'motivo do ban');
``` 

## unBanUser(channel, moderatorBot, userBanned)
- Desbane um usuário previamente banido.
```javascript
twitchModeration.unBanUser('canal', 'bot', 'usuarioDesbanned');
```

## GetBlockedTerms(channel, moderatorBot, full)
- Obtém os termos bloqueados no chat.
```javascript
twitchModeration.GetBlockedTerms('canal', 'bot').then(res => console.log(res))
```

## AddBlockedTerm(channel, moderatorBot, textBlock)
- Adiciona um termo à lista de bloqueio.
```javascript
twitchModeration.AddBlockedTerm('canal', 'bot', 'palavraBloqueada');
```

## RemoveBlockedTerm(channel, moderatorBot, ...messageBlocks)
- Remove termos da lista de bloqueio.
```javascript
twitchModeration.RemoveBlockedTerm('canal', 'bot', 'palavra1', 'palavra2');
```

## RemoveMessageChat(channel, moderatorBot, tags.id)
- Apaga uma mensagem especifica do chat.
``` javascript
twitchModeration.RemoveMessageChat('canal', 'bot', tags.id)
```

## TimeoutUser(channel, moderatorBot)
- O usuário é temporariamente silenciado por um período específico antes de poder enviar mensagens novamente.
``` javascript
twitchModeration.TimeoutUser('canal', 'bot', tags.id, 30, motivoTimeOut = 'Nada')
```

## DeleteChatAllMessages(channel, moderatorBot)
- Apaga todas as mensagens do chat.
``` javascript
twitchModeration.DeleteChatAllMessages('canal', 'bot');
```

## UpdateChatSettings(channel, moderatorBot, chatSettings)
- Atualiza as configurações do chat.
```javascript
const settings = {
    slow_mode: true,
    slow_mode_wait_time: 10,
    // ... outras configurações
};

/*
config que podem ser passadas -> Api-Twitch
      "slow_mode": true,
      "slow_mode_wait_time": 10,
      "follower_mode": false,
      "follower_mode_duration": null,
      "subscriber_mode": false,
      "emote_mode": false,
      "unique_chat_mode": false,
      "non_moderator_chat_delay": false,
      "non_moderator_chat_delay_duration": null

*/
twitchModeration.UpdateChatSettings('canal', 'bot', settings);
```
## SendWhisper(userModBot, userMSG, Msg)
- Envia uma mensagem privada (whisper) para outro usuário. O usúario não pode está com o "sussuro" bloquado, se isso ocorre a mensagem não é enviada.
```javascript
twitchModeration.SendWhisper('modBot', 'user', 'Olá! Como você está?');
```
## GetGameId(gameName)
- Obtém a ID e o nome do jogo com base no nome do jogo.
```javascript
const gameInfo = await twitchModeration.GetGameId('gameName');
