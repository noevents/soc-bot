module.exports = {
	handle: function (ctx, message, sendMessage) {
		var user = ctx.storage.getItemSync('user-' + message.from.id);
		if(user == undefined){
			user = 
			{
				id: message.from.id,
				username: message.from.username,
				session: {
					route: null,
					threadPosition: null,
					editableMessageId: null,
					tgUsername: false
				},
				text: null
			} 
		} else user = user;

		ctx.storage.setItem('user-' + message.from.id, user)
		sendMessage(ctx, message.from.id, 'Hi!');
	}
}
