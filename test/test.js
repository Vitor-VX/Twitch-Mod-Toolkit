const TwitchModerationAPI = require("../twitch-moderation-tools");


const Twitch = new TwitchModerationAPI("TOKEN", "CLIENT-ID");

Twitch.GetGameId("Slots").then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});

Twitch.DeleteChatAllMessages("jvzx_", "streamsquawk").then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});

Twitch.GetInfoUser("jvzx_").then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

Twitch.BanUser("jvzx_", "streamsquawk", "lucas12345", "teste").then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

Twitch.TimeoutUser("jvzx_", "streamsquawk", "lucas12345", 30).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

Twitch.unBanUser("jvzx_", "streamsquawk", "lucas12345").then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

Twitch.AddBlockedTerm("jvzx_", "streamsquawk", "merda").then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

Twitch.SendWhisper("streamsquawk", "loud_coringa", "Olá!").then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});