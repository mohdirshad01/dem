if (checkUser) {
    const botInfo = await bot.getMe();
    const botUsername = botInfo.username;
    if (!checkUser[0].isJoined) {
        welcomeMessage = "<b>User Already Started the bot</b>";
        bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
    } else {
        welcomeMessage = "<b>🛑 Must Join Total Channel To Use Our Bot</b>";
        bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
    }
} else {
    welcomeMessage = "<b>🛑 Must Join Total Channel To Use Our Bot</b>";
    bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
    const newUser = new User({
        user_id: chatId,
        isJoined: false,
        botUsername: botUsername
    });
    await newUser.save();
}