module.exports = {
	// filling user profile here
	handle: function (ctx, message, sendMessage) {
		sendMessage(ctx, message.from.id, 'Твоя анкета.');
	}
};
