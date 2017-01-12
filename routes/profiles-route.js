module.exports = {
	// returning profiles from db here
	handle: function (ctx, message, sendMessage) {
		sendMessage(ctx, message.from.id, 'Анкеты из этого бота.');
	}
};
