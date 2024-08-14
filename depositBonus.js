import { bot } from "./server.js";
import Link from "./Link.js";
import Channel from "./Channel.js";
export async function depositBonus(msg) {
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
        const checkLink = await Link.findOne({botUsername: botUsername});

        if (!checkLink || !checkLink.link) {
            throw new Error('No link found in the database.');
        }

        const storedLink = checkLink.link;
        const giftText = "<b>✅ World Biggest BUG Loot 🔥\nFlat ₹1000 Profit No Risk 😎\n\n200 Add Per ₹100 Bonus\n₹400 Add Per ₹200 Bonus\n₹1000 Add Per ₹500 Bonus\n\n👉Minimum Withdrawal ₹110\n\n🔗 Offer Register Here:: " + storedLink + "\n\n👉In999 New Account Per First Time ₹1000 Deposit Per Flat ₹500 Bonus Milrha Only 1x Wager Trick Suno.......!! 😱👇\n\n🔴 Trick >> 2 Phone Lelo 2 New Account Banao Dono Mein Real Bank Add Karlo Then Dono Mein ₹1000+₹1000 Deposit Karke ₹500+₹500 Bonus Claim Karo !!\n\n👉 Now Wingo Game Mein Jao 1 Account Se ₹1500 BIG Per Lagado 2nd Account Se ₹1500 Small Per Ak Account Win Flat ₹3000 Instant Withdraw Krlo 😱❤️\n\nGuaranteed Payment No Loss 😍\nOffer Only For First Time Deposit ✓✓\n\n</b>";
        const giftImage = "https://i.ibb.co/RDsRr12/bonus.jpg";
        await bot.sendPhoto(chatId, giftImage, {
            caption: giftText,
            parse_mode: "HTML"
        });
    }
    catch (error) {
        console.log(error)
    }
}