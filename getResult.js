import { bot } from "./server.js";
import { getResult } from "./functions.js";
import Channel from "./Channel.js";
export async function getNewResult(msg) {
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
        const fetchRes = await getResult();
        if (fetchRes.length < 5) {
            throw new Error('Not enough data available from API.');
        }
        const chartKeyBoardOpts = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Period', callback_data: 'level' },
                        { text: 'Result', callback_data: 'amount' }
                    ],
                    [
                        { text: fetchRes[0].periodNumber, callback_data: `result_0` },
                        { text: fetchRes[0].resultSize.toString(), callback_data: `result_0` }
                    ],
                    [
                        { text: fetchRes[1].periodNumber, callback_data: `result_1` },
                        { text: fetchRes[1].resultSize.toString(), callback_data: `result_1` }
                    ],
                    [
                        { text: fetchRes[2].periodNumber, callback_data: `result_2` },
                        { text: fetchRes[2].resultSize.toString(), callback_data: `result_2` }
                    ],
                    [
                        { text: fetchRes[3].periodNumber, callback_data: `result_3` },
                        { text: fetchRes[3].resultSize.toString(), callback_data: `result_3` }
                    ],
                    [
                        { text: fetchRes[4].periodNumber, callback_data: `result_4` },
                        { text: fetchRes[4].resultSize.toString(), callback_data: `result_4` }
                    ],
                ]
            },
            parse_mode: "HTML"
        };

        bot.sendMessage(chatId, "<b>🔒 Last Five Results Are :</b>", chartKeyBoardOpts);
    } catch (error) {
        console.error('Error in getNewResult function:', error);
    }
}
