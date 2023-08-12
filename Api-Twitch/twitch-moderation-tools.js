/*
    REQUISIÇÕES PARA MODERAÇÃO

    TODAS AS INFOS SÃO BASEADAS NA API OFICIAL DA TWTICH -> https://dev.twitch.tv/docs/api
*/
const request = require('request');
const POST = 'POST', GET = 'GET', DELETE = 'DELETE';

class TwitchModerationAPI {
    constructor(authToken, clientId) {
        this.headers = {
            'Authorization': `Bearer ${authToken}`,
            'Client-Id': clientId,
            'Content-Type': 'application/json'
        };
    }

    async requestTwitchApi(options, jsonOpt) {
        if (jsonOpt === true) {
            return new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    const data = JSON.parse(body);
                    if (error) return reject(error);
                    resolve(data);
                });
            });
        } else {
            request(options, (error, response, body) => {
                return console.log(body);
            });
        }
    }

    async optionsREQ(url, method, headers, responseApi = true) {
        const options = {
            url: url,
            method: method,
            headers: headers
        };

        try {
            const responseData = await this.requestTwitchApi(options, responseApi);
            return responseData;
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    async GetInfoUser(...nomeUserTwitch) {
        try {
            const promises = nomeUserTwitch.map(nomeUser => {
                const options = {
                    url: `https://api.twitch.tv/helix/users?login=${nomeUser}`,
                    method: GET,
                    headers: this.headers
                };

                return new Promise((resolve, reject) => {
                    request(options, (error, response, body) => {
                        if (error) {
                            return reject(error);
                        }
                        const data = JSON.parse(body).data;
                        const userId = data.find(user => user.login === nomeUser);
                        resolve(userId ? userId.id : null);
                    });
                });
            });

            const usersIds = await Promise.all(promises);
            return usersIds;
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    async BanUser(channel, moderatorBot, userBanned, motivoBan = 'Nada') {
        const [resolvedChannel, resolvedModeratorBot, resolvedUserBanned] = await this.GetInfoUser(channel, moderatorBot, userBanned);

        const options = {
            url: `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${resolvedChannel}&moderator_id=${resolvedModeratorBot}`,
            method: POST,
            headers: this.headers,
            body: JSON.stringify({
                data: {
                    'user_id': `${resolvedUserBanned}`,
                    'reason': `${motivoBan}`
                }
            })
        };

        await this.requestTwitchApi(options, false);
    }

    async unBanUser(channel, moderatorBot, userBanned) {
        const [resolvedChannel, resolvedModeratorBot, resolvedUserBanned] = await this.GetInfoUser(channel, moderatorBot, userBanned);

        const options = {
            url: `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${resolvedChannel}&moderator_id=${resolvedModeratorBot}&user_id=${resolvedUserBanned}`,
            method: DELETE,
            headers: this.headers
        };

        await this.requestTwitchApi(options, false);
    }

    async GetBlockedTerms(channel, moderatorBot, full = true) {
        try {
            const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

            const options = {
                url: `https://api.twitch.tv/helix/moderation/blocked_terms?broadcaster_id=${resolvedChannel}&moderator_id=${resolvedModeratorBot}`,
                method: GET,
                headers: this.headers
            };

            const responseData = await this.requestTwitchApi(options, true);

            if (full === true) {
                return responseData;
            }

            const verificPalavraBlock = responseData.data.find(e => e.text === full);
            if (!verificPalavraBlock) {
                return `Palavra ${full} não encontrada!`;
            }

            return verificPalavraBlock.id;
        } catch (error) {
            return error;
        }
    }

    async AddBlockedTerm(channel, moderatorBot, textBlock) {
        const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

        const options = {
            url: `https://api.twitch.tv/helix/moderation/blocked_terms?broadcaster_id=${resolvedChannel}&moderator_id=${resolvedModeratorBot}`,
            method: POST,
            headers: this.headers,
            body: JSON.stringify({
                'text': `${textBlock}`
            })
        };

        await this.requestTwitchApi(options, true);
        console.log(`Palavra ${textBlock} bloqueada com sucesso!`);
    }

    async RemoveBlockedTerm(channel, moderatorBot, ...messageBlocks) {
        try {
            const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

            for (const messageBlock of messageBlocks) {
                const idMessageBlock = await this.GetBlockedTerms(channel, moderatorBot, messageBlock);

                const options = {
                    url: `https://api.twitch.tv/helix/moderation/blocked_terms?broadcaster_id=${resolvedChannel}&moderator_id=${resolvedModeratorBot}&id=${idMessageBlock}`,
                    method: DELETE,
                    headers: this.headers
                };

                await this.requestTwitchApi(options, false);
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    async DeleteChatAllMessages(channel, moderatorBot) {
        const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

        const options = {
            url: `https://api.twitch.tv/helix/moderation/chat?broadcaster_id=${resolvedChannel}&moderator_id=${resolvedModeratorBot}`,
            method: DELETE,
            headers: this.headers
        };

        await this.requestTwitchApi(options, false);
        console.log('Todas as mensagens do chat foram apagadas!');
    }
}

module.exports = TwitchModerationAPI;