import { bot } from "./server.js";
import { cancelKeyboard } from "./config.js";
import Channel from "./Channel.js";
const fundManagement = async (msg) => {
  function calculate(input) {
    const result1 = Math.floor(input / 31);
    const nums = [1, 2, 4, 8, 16].map((num) => result1 * num);
    return nums;
  }
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
    await bot.sendMessage(chatId, '<b>Enter your balance for the chart:</b>', cancelKeyboard);
    const balanceResponse = await new Promise((resolve) => {
      bot.once('message', (msg) => {
        resolve(msg.text);
      });
    });
    const availableBalance = balanceResponse;
    if (availableBalance != "Cancel") {
      if (isNaN(availableBalance) || availableBalance < 100 || availableBalance > 100000) {
        await bot.sendMessage(chatId, '<b>Please enter a valid amount between 100 to 100000!</b>', { parse_mode: "HTML" });
        return;
      }
      const fundChart = calculate(availableBalance);
      const chartText = "<b>🌟 5 Level Fund Breakdown 🌟</b>";
      const chartKeyBoardOpts = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Level 👇', callback_data: 'level' },
              { text: 'Amount 👇', callback_data: 'amount' }
            ],
            [
              { text: 'Level 1', callback_data: 'level' },
              { text: fundChart[0].toString(), callback_data: 'amount' }
            ],
            [
              { text: 'Level 2', callback_data: 'level' },
              { text: fundChart[1].toString(), callback_data: 'amount' }
            ],
            [
              { text: 'Level 3', callback_data: 'level' },
              { text: fundChart[2].toString(), callback_data: 'amount' }
            ],
            [
              { text: 'Level 4', callback_data: 'level' },
              { text: fundChart[3].toString(), callback_data: 'amount' }
            ],
            [
              { text: 'Level 5', callback_data: 'level' },
              { text: fundChart[4].toString(), callback_data: 'amount' }
            ],
          ]
        },
        caption: chartText,
        parse_mode: "HTML"
      };
      const photo = 'https://i.ibb.co/SxksK3f/fund.jpg';
      await bot.sendPhoto(chatId, photo, chartKeyBoardOpts);
    }
  } catch (error) {
    console.error('Error in fundManagement:', error);
  }
};

export default fundManagement;
