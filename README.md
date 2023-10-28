# Módulo-Twitch-Moderation
Biblioteca para Chat Bot da Twitch: inclui funções para banir, desbanir, bloquear palavras e muito mais;

### Antes de começar a instalação, é importante ter em mente alguns pontos:
- Este módulo não inclui um chat bot completo por si só. Você precisará utilizar outras bibliotecas para desenvolver o bot de chat. Recomendamos a biblioteca tmi.js, que também é usada em outro projeto. Se você já tem experiência em criar bots para a Twitch, sabe que a Twitch agora exige que solicitações sejam feitas para usar determinadas funcionalidades no bot de chat.

- Este módulo se concentra nas funcionalidades de moderação, como banir, desbanir, bloquear palavras, entre outras. Ele fornece as ferramentas necessárias para interagir com a plataforma da Twitch e implementar essas funcionalidades em seu chat bot.

- Lembre-se de que este módulo é uma ferramenta poderosa para aprimorar a moderação e funcionalidades do seu bot na Twitch. Vamos prosseguir com a instalação e configuração para que você possa começar a usar essas funcionalidades em seu projeto.

## Passo 1: Configuração da Conta no Twitch Developer
- Acesse o site do Twitch Developer em seu navegador.
- Se você já possui uma conta no Twitch, faça login na sua conta.
- Caso contrário, siga as etapas abaixo para criar uma nova conta no Twitch Developer:
  - Clique na opção "Sign Up" (Cadastrar-se) para iniciar o processo de criação de conta.
  - Siga as instruções fornecidas para preencher os detalhes necessários.
- Após criar a conta e fazer login, siga as próximas etapas.

## Passo 2: Registro de Novo Aplicativo e Geração do Client-ID e Token
- Agora é hora de registrar um novo aplicativo na plataforma Twitch Developer para obter seu Client-ID. Além disso, é fundamental especificar uma URL válida onde o token de acesso será gerado. Certifique-se de que o site esteja ativo, pois erros podem ocorrer durante as solicitações se a URL não estiver acessível.
  - Siga os passos abaixo para registrar seu aplicativo e obter o Client-ID e o token:
    - Acesse o site do Twitch Developer no seu navegador.
    - Faça login na sua conta do Twitch.
    - No painel de controle do desenvolvedor, clique na opção "Your Console" (Seu Console) no canto superior direito.
    - No menu de navegação, escolha a opção "Applications" (Aplicativos).
    - Clique no botão "Register Your Application" (Registrar Seu Aplicativo).
    - Complete os detalhes do aplicativo, incluindo nome, descrição e a URL do site. Garanta que a URL do site esteja funcional para a geração correta do token.
    - Na seção "OAuth Redirect URLs" (URLs de Redirecionamento do OAuth), adicione a URL do site onde você deseja que o token seja gerado.
    - Após preencher os detalhes, clique no botão "Create" (Criar) para registrar o aplicativo como na imagem abaixo:
    
    ![Imagem do Twitch](https://i.imgur.com/lO2Ilej.jpg)

    - Depois de registrar o aplicativo, você receberá um Client-ID único. Anote este Client-ID, pois você precisará dele para fazer solicitações à plataforma da Twitch.

## Passo 3: Autorização e Geração do Token
- Neste passo, você utilizará o Client-ID que registrou na etapa anterior para gerar um token de acesso. Esse token será usado para fazer solicitações à plataforma da Twitch. Para simplificar, pegaremos o token diretamente a partir da URL de redirecionamento. O módulo utiliza essas permissões:
    ```
    https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=SEU_CLIENT_ID_AQUI&redirect_uri=SUA_URL_QUE_FOI_COLOCADA_NO_SEU_APP&scope=chat:read+chat:edit+channel:moderate+whispers:read+whispers:edit+channel_editor+moderator:manage:banned_users+moderation:read+moderator:manage:banned_users+moderator:manage:chat_messages+moderator:read:chatters+moderator:manage:blocked_terms+moderator:manage:chat_messages+moderator:manage:chat_settings+user:manage:whispers+channel:manage:broadcast+user:read:email
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
