import { bot } from "./server.js";
import { getPrediction } from "./functions.js";
import Channel from "./Channel.js";

export async function getNewPrediction(msg) {
    try {
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;
        const chatId = msg.chat.id;
        const channelsDoc = await Channel.findOne({botUsername: botUsername});

        if (!channelsDoc) {
            throw new Error('No channel document found.');
        }

        const channels = channelsDoc.channels || [];
        let isMemberOfAllChannels = true;

        for (const channel of channels) {
            try {
                const chatMember = await bot.getChatMember(channel.chatId, chatId);
                if (chatMember.status === 'left' || chatMember.status === 'kicked') {
                    isMemberOfAllChannels = false;
                }
            } catch (error) {
                console.error(`Error checking membership for channel ${channel.chatId}:`, error);
                isMemberOfAllChannels = false;
            }
        }

        if (!isMemberOfAllChannels) {
            const channelButtons = [];
            for (let i = 0; i < channels.length; i += 2) {
                const row = [];
                const firstChannel = channels[i];
                const secondChannel = channels[i + 1] || null;

                if (firstChannel && firstChannel.link) {
                    row.push({ text: '📢 Join', url: firstChannel.link });
                }
                if (secondChannel && secondChannel.link) {
                    row.push({ text: '📢 Join', url: secondChannel.link });
                }
                if (row.length > 0) {
                    channelButtons.push(row);
                }
            }

            const startKeyBoardOpts = {
                reply_markup: {
                    inline_keyboard: [
                        ...channelButtons,
                        [
                            { text: 'Verify', callback_data: 'check_join' }
                        ]
                    ]
                },
                parse_mode: 'HTML'
            };
            const welcomeMessage = "<b>🛑 Must Join Total Channel To Use Our Bot</b>";
            await bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
            return
        }
        const fetchPred = await getPrediction();
        if (fetchPred.result == 'Big') {
            const predMes = "<b>WinGO 1 MIN\n\n🚀 Period - " + fetchPred.period + "\n\n🚀 Purchasing: " + fetchPred.result + "💸\n\nI Always Use 2X Plan, For 100 % Gurantee Of My Profits\n\nAlways Play Through Fund Management only 5 - Level</b>";
            const photo = 'https://i.ibb.co/nwWYFJG/big.jpg';
            bot.sendPhoto(chatId, photo, {
                caption: predMes,
                parse_mode: "HTML"
            });
            await bot.sendSticker(chatId, "CAACAgUAAxkBAW8K_GaeMnxamezi5mmdJ4u7Ylbbj8F9AAJSAwAC0qoBVU3NipS4NOxCNQQ")
            return;
        }
        if (fetchPred.result == 'Small') {
            const predMes = "<b>WinGO 1 MIN\n\n🚀 Period - " + fetchPred.period + "\n\n🚀 Purchasing: " + fetchPred.result + "💸\n\nI Always Use 2X Plan, For 100 % Gurantee Of My Profits\n\nAlways Play Through Fund Management only 5 - Level</b>";
            const photo = 'https://i.ibb.co/Dr384MZ/small.jpg';
            bot.sendPhoto(chatId, photo, {
                caption: predMes,
                parse_mode: "HTML"
            });
            await bot.sendSticker(chatId, "CAACAgUAAxkBAW8K_GaeMnxamezi5mmdJ4u7Ylbbj8F9AAJSAwAC0qoBVU3NipS4NOxCNQQ")
            return;
        }
    }
    catch (error) {
        console.log(error);
    }
}