# Api-Twitch-Moderation
API para Chat Bot da Twitch: inclui funções para banir, desbanir, bloquear palavras e muito mais;

### Antes de começar a instalação, é importante ter em mente alguns pontos:
- Esta API não inclui um chat bot completo por si só. Você precisará utilizar outras bibliotecas para desenvolver o bot de chat. Recomendamos a biblioteca tmi.js, que também é usada em outro projeto. Se você já tem experiência em criar bots para a Twitch, sabe que a Twitch agora exige que solicitações sejam feitas para usar determinadas funcionalidades no bot de chat.

- Esta API se concentra nas funcionalidades de moderação, como banir, desbanir, bloquear palavras, entre outras. Ela fornece as ferramentas necessárias para interagir com a API da Twitch e implementar essas funcionalidades em seu chat bot.

- Lembre-se de que esta API é uma ferramenta poderosa para aprimorar a moderação e funcionalidades do seu bot na Twitch. Vamos prosseguir com a instalação e configuração para que você possa começar a usar essas funcionalidades em seu projeto.

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

    - Depois de registrar o aplicativo, você receberá um Client-ID único. Anote este Client-ID, pois você precisará dele para fazer solicitações à API da Twitch.

## Passo 3: Autorização e Geração do Token
- Neste passo, você irá utilizar o Client-ID que registrou no passo anterior para gerar um token de acesso que será utilizado para fazer solicitações à API da Twitch. Siga as instruções abaixo:
  - Abra seu navegador e acesse o URL de autorização.
  - Na URL a seguir, substitua "SEU_CLIENT_ID_AQUI" pelo Client-ID que você registrou anteriormente e "SUA_URL_QUE_FOI_COLOCADA_NO_SEU_APP" pela URL do seu aplicativo que você cadastrou:
    ```
    https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=SEU_CLIENT_ID_AQUI&redirect_uri=SUA_URL_QUE_FOI_COLOCADA_NO_SEU_APP&scope=chat:read+chat:edit+channel:moderate+whispers:read+whispers:edit+channel_editor+moderator:manage:banned_users+moderation:read+moderator:manage:banned_users+moderator:manage:chat_messages+moderator:read:chatters+moderator:manage:blocked_terms+moderator:manage:chat_messages
    ```
  - A URL formatada irá direcioná-lo para uma página de autorização da Twitch. Faça login com sua conta.
  - Após autorizar o acesso, você será redirecionado para a URL que você especificou no seu aplicativo, contendo o token de acesso na URL.
  - Copie o token da URL, ele estará após o trecho "#access_token=", como na imagem abaixo:

    ![Imagem do Twitch](https://i.imgur.com/80qOIHt.jpg)

## Passo 4: Token de Acesso
- Após a autorização bem-sucedida e o redirecionamento para a URL especificada no seu aplicativo, você receberá um corpo de resposta contendo o seu token de acesso. Esse token é essencial para realizar ações com o seu bot e utilizar a API deste projeto. É importante manter esse token em sigilo e não compartilhá-lo com terceiros, pois ele concede acesso às funcionalidades do seu aplicativo.


# Próxima Etapa: Como vou utilizar essa Api agora?
- Antes de começar a usar as funcionalidades de moderação da API, você precisa configurar um código base para se conectar ao chat do canal específico e receber eventos de mensagens do chat. Siga os passos abaixo:

1. Utilize uma biblioteca apropriada para interagir com o chat da Twitch. Recomendamos a biblioteca tmi.js, que é amplamente utilizada para esse propósito.

2. Instale a biblioteca tmi.js em seu projeto utilizando o npm (Node Package Manager):
   ``` npm i tmi.js ```

3. Agora faremos o tal do "código base":
```
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

// Importação da biblioteca TwitchModerationAPI
const TwitchModerationAPI = require('./ModerationApi')

// Evento principal para receber mensagens do chat e aplicar moderação
twitch.on('message', (canalTwitch, tags, message, selfBot) => {
canalTwitch = canalTwitch.replace('#', '')
    // Instanciando a biblioteca TwitchModerationAPI
    const twitchModeration = new TwitchModerationAPI(SEU_TOKEN_TWITCH, SEU_CLIENT_ID)

    // Nome de usuário do seu bot (por exemplo: joxsbot)
    const NOME_DE_USUARIO_DO_SEU_BOT = 'NOME_CORRETO_DO_USER_DO_SEU_BOT_NA_TWITCH'
    const USER_PARA_BANIR = 'USER_QUE_VOCE_DESEJA_BANIR'
    
    // Verificando se a mensagem começa com "!ban"
    if (message.toLowerCase().startsWith('!ban')) {
        // Chamando o método BanUser da biblioteca TwitchModerationAPI
        twitchModeration.BanUser(canalTwitch, `${NOME_DE_USUARIO_DO_SEU_BOT}`, `${USER_PARA_BANIR}`)
    }
})

// Conectando o bot ao chat da Twitch
twitch.connect().then(() => console.log('Bot conectado ao chat da Twitch!'))

```
