module.exports = {
	handle: function (ctx, message, sendMessage) {
		sendMessage(ctx, message.from, 'Hi!');
	}
};
