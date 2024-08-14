import { predictionKeyboard } from "./config.js";
import { bot } from "./server.js";
import Channel from "./Channel.js";
export async function Prediction(msg) {
    try {
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;
        if (msg.text === "Prediction") {
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
            const welcomeMessage = "<b>👋Hey " + msg.chat.first_name + " Welcome To Our Premium Prediction Bot !\n\nPlease select the Option Below</b>";
            bot.sendMessage(chatId, welcomeMessage, predictionKeyboard);
            return;
        }
    }
    catch (error) {
        console.log(error)
    }
}