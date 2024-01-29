/*
    REQUISIÇÕES PARA MODERAÇÃO

    TODAS AS INFOS SÃO BASEADAS NA API OFICIAL DA TWTICH -> https://dev.twitch.tv/docs/api
*/
const axios = require('axios')
const { HandleError } = require("./utils/utils");

class TwitchModerationAPI {
    #headers
    constructor(authToken, clientId) {
        this.headers = {
            'Authorization': `Bearer ${authToken}`,
            'Client-Id': clientId,
            'Content-Type': 'application/json'
        };
    }

    async GetInfoUser(...nomeUserTwitch) {
        try {
            const userIdPromises = nomeUserTwitch.map(async (nome) => {
                try {
                    const result_login = await axios.get(`https://api.twitch.tv/helix/users?login=${nome}`, {
                        headers: this.headers
                    });

                    const userId = result_login.data.data.find((user) => user.login === nome);

                    if (userId !== undefined && userId !== null) {
                        const result_follow = await axios.get(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId.id}`, {
                            headers: this.headers
                        });

                        const follow = result_follow.data.total;

                        const response = {
                            user_id: userId.id,
                            follows_total: follow,
                            login: userId.login,
                            description: userId.description,
                            img_user: userId.profile_image_url,
                            view_count: userId.view_count,
                            email_client: userId.email !== undefined ? userId.email : "Token de email inválido.",
                            created: userId.created_at
                        };

                        return response;
                    } else {
                        return "User not found!";
                    }
                } catch (err) {
                    return HandleError(err)
                }
            });

            return await Promise.all(userIdPromises);
        } catch (error) {
            return HandleError(error);
        }
    }

    async BanUser(channel, moderatorBot, userBanned, motivoBan = 'Nada') {
        try {
            const [resolvedChannel, resolvedModeratorBot, resolvedUserBanned] = await this.GetInfoUser(channel, moderatorBot, userBanned);

            const result = await axios.post(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}`, {
                data: {
                    user_id: resolvedUserBanned.user_id,
                    reason: motivoBan
                }
            }, {
                headers: this.headers
            })

            return result.data.data[0]
        } catch (error) {
            return HandleError(error, error.response.data.message)
        }
    }

    async TimeoutUser(channel, moderatorBot, userName, durationTimeOut, motivoTimeOut = 'Nada') {
        try {
            const [resolvedChannel, resolvedModeratorBot, resolvedUserTimeout] = await this.GetInfoUser(channel, moderatorBot, userName)

            const responseTwitch = await axios.post(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}`, {
                data: {
                    user_id: resolvedUserTimeout.user_id,
                    duration: durationTimeOut,
                    reason: motivoTimeOut
                }
            }, {
                headers: this.headers
            })

            return responseTwitch.data
        } catch (error) {
            return HandleError(error, error.response.data.message);
        }
    }

    async unBanUser(channel, moderatorBot, userBanned) {
        try {
            const [resolvedChannel, resolvedModeratorBot, resolvedUserBanned] = await this.GetInfoUser(channel, moderatorBot, userBanned);

            const result = await axios.delete(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}&user_id=${resolvedUserBanned.user_id}`, {
                headers: this.headers
            })

            return `User unbanned.`
        } catch (error) {
            return HandleError(error, error.response.data.message);
        }
    }

    async GetBlockedTerms(channel, moderatorBot, search = false) {
        try {
            const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

            const result = await axios.get(`https://api.twitch.tv/helix/moderation/blocked_terms?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}`, {
                headers: this.headers
            })

            if (!search) {
                return result.data.data
            }

            const verificFraseBlock = result.data.data.find(t => t.text === search)
            if (!verificFraseBlock) {
                return `Word not found.`
            }

            return verificFraseBlock
        } catch (error) {
            return HandleError(error, error.response.data.message)
        }
    }

    async AddBlockedTerm(channel, moderatorBot, ...textBlock) {
        try {
            const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

            const resultAllTextBlock = textBlock.map(async el => {
                const result = await axios.post(`https://api.twitch.tv/helix/moderation/blocked_terms?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}`, {
                    text: el
                }, {
                    headers: this.headers
                });

                return result.data.data[0]
            });

            return await Promise.all(resultAllTextBlock);
        } catch (error) {
            return HandleError(error, error.response.data.message);
        }
    }

    async RemoveBlockedTerm(channel, moderatorBot, ...messageBlocks) {
        try {
            const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

            for (const messageBlock of messageBlocks) {
                const idMessageBlock = await this.GetBlockedTerms(channel, moderatorBot, messageBlock);

                await axios.delete(`https://api.twitch.tv/helix/moderation/blocked_terms?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}&id=${idMessageBlock.id}`, {
                    headers: this.headers
                })
            }
            return `Text [${messageBlocks.join(', ')}] deleted.`
        } catch (error) {
            return HandleError(error, error.response.data.message);
        }
    }

    async RemoveMessageChat(channel, moderatorBot, messageID) {
        try {
            const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

            const response = await axios.delete(`https://api.twitch.tv/helix/moderation/chat?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}&message_id=${messageID}`, {
                headers: this.headers
            })

            return response.data
        } catch (error) {
            return HandleError(error, error.response.data.message);
        }
    }

    async DeleteChatAllMessages(channel, moderatorBot) {
        try {
            const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

            await axios.delete(`https://api.twitch.tv/helix/moderation/chat?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}`, {
                headers: this.headers
            })

            return `All chat messages have been deleted.`
        } catch (error) {
            return HandleError(error, error.response.data.message);
        }
    }

    async UpdateChatSettings(channel, moderatorBot, chatSettings = {}) {
        try {
            const [resolvedChannel, resolvedModeratorBot] = await this.GetInfoUser(channel, moderatorBot);

            const finalChatSettings = {
                slow_mode: true,
                slow_mode_wait_time: 10,
                follower_mode: false,
                follower_mode_duration: null,
                subscriber_mode: false,
                emote_mode: false,
                unique_chat_mode: false,
                non_moderator_chat_delay: false,
                non_moderator_chat_delay_duration: null,
                ...chatSettings
            };

            const result = await axios.patch(`https://api.twitch.tv/helix/chat/settings?broadcaster_id=${resolvedChannel.user_id}&moderator_id=${resolvedModeratorBot.user_id}`, finalChatSettings, {
                headers: this.headers
            });

            return result.data.data;
        } catch (error) {
            return HandleError(error, error.response.data.message);
        }
    }

    async GetGameId(gameName) {
        try {
            const response = await axios.get(`https://api.twitch.tv/helix/games?name=${gameName}`, {
                headers: this.headers
            });

            const info = response.data.data;

            if (info != "") {
                return info[0];
            }

            return `Teg id '${gameName}' not found`
        } catch (error) {
            return HandleError(error);
        }
    }

    async SendWhisper(userModBot, userMSG, Msg) {
        try {
            const [bot, user] = await this.GetInfoUser(userModBot, userMSG)

            const result = await axios.post(`https://api.twitch.tv/helix/whispers?from_user_id=${bot.user_id}&to_user_id=${user.user_id}`, {
                message: Msg
            }, {
                headers: this.headers
            })

            return `Message sent to the user ${userMSG}`
        } catch (error) {
            return HandleError(error, error.response.data.message);
        }
    }
}

module.exports = TwitchModerationAPI;