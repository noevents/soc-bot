module.exports = {

	handle: function (ctx, message) {
		// if (isAuth())
			var user = ctx.storage.getItemSync('user-' + message.from.id);
			var routeName
			var profileFilling = null
			if(message.text.search(/\/\w+/) == 0){
				routeName = null
				for(var key in ctx.commands){
					routeName = (ctx.commands[key].command == message.text) ? ctx.commands[key].command : null;
					break
				} 
				
			}else{
				routeName = (ctx.commands[message.text] == null) ? null : ctx.commands[message.text].command;
			}
			if(user != null && user.session.route == 'profile' && routeName == null){
				routeName = '/profile'
				profileFilling = true
			}else{
				routeName = routeName
			}
			if (routeName != null) {
				try {
					var route = require('./routes' + routeName + '-route.js');
					route.handle(ctx, message, this.sendBasicMessage, profileFilling);
				} catch (err) {
					console.log(err);
				}
			} else {
				this.sendBasicMessage(ctx, message.from.id, 'Непонятная команда');
			}
	},
	handleCallback: function(ctx, message) {
		if(message.data == 'remove_username' || message.data == 'add_username'){
			try {
				var route = require('./routes/profile-route.js');
				route.handleCallback(ctx, message);
			} catch (err) {
				console.log(err)
			}
		}else{
			try {
				var route = require('./routes/thread-route.js');
				route.handleCallback(ctx, message);
			} catch (err) {
				console.log(err)
			}
		}
		
	},
	// handleFile
	sendBasicMessage: function (ctx, to, response) {
		ctx.bot.sendMessage(to, response, {parse_mode: 'HTML', reply_markup: getReplyMarkups(ctx, to.id)});
	}
};

function isAdmin(ctx, userId) {
    return ctx.config.admin === userId;
}

function getReplyMarkups(ctx, userId) {
	var replyMarkupArray = {keyboard: [[]], resize_keyboard: true};
	var i = 0, j = 0, columnCount = 2;
	for (var key in ctx.commands) {
		if (!ctx.commands[key].hidden && (isAdmin(ctx, userId) || !ctx.commands[key].admin)) {
			replyMarkupArray.keyboard[i].push(key);
			j = (j < columnCount - 1) ? j + 1 : 0;
			if (j == 0) {
				replyMarkupArray.keyboard.push([]);
				i++;
			}
		}
	}
	return JSON.stringify(replyMarkupArray);
}