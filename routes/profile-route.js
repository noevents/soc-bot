var router = require('../router.js');
var ctx = null;

module.exports = {
	handle: function (_ctx, message, sendBasicMessage, fill) {
		ctx = _ctx;
		var user = ctx.storage.getItemSync('user-' + message.from.id)
		var basicResponse = "Отправь мне текст своей анкеты.\n1. Город, возраст, пол\n2. Об интересах в двух словах\n3. Кого ищем?\n4. Контакты"
		if(fill){
			user.text = message.text
		}
		if(user.text == null){
			sendMessage(ctx, user, basicResponse);
		}else{
			sendMessage(ctx, user, user.text);
		}
		
	},
	handleCallback: function(_ctx, message) {
		ctx = _ctx;
		var user = ctx.storage.getItemSync('user-' + message.from.id);
		if(user.text == null){
			sendMessage(ctx, user, 'Сначала отправь текст анкеты');
		}else{
			sendMessage(ctx, user, user.text, message.data);
		}
	}
};

function sendMessage(ctx, user, _response, addTgButton) {
	var _user = user
	var response = _response
	if(addTgButton == null && _user.text == null){
		ctx.bot.sendMessage(_user.id, response, {
			reply_markup: getReplyMarkup(_user.session.tgUsername)
		})
		.then(function(result){
			_user.session.editableMessageId = result.message_id
		})
	}else{
		var regexp = new RegExp("\@("+_user.username+")", "i");
		var hasUsername = (_user.text.search(regexp) == -1) ? false : true;
		if(addTgButton == 'add_username' && !hasUsername){
			_user.text += '\n@'+_user.username
			response = _user.text
			_user.session.tgUsername = true
		}else if(addTgButton == 'remove_username' && hasUsername){
			_user.text = _user.text.replace('\n@'+_user.username, '');
			response = _user.text
			_user.session.tgUsername = false
		}
		ctx.bot.editMessageText(response, {
			chat_id: _user.id,
			message_id: _user.session.editableMessageId,
			reply_markup: getReplyMarkup(_user.session.tgUsername)
		})
	}
	_user.session.route = 'profile'
	ctx.storage.setItem('user-' + _user.id, _user);

}
function getReplyMarkup(usernameState) {
	var replyMarkupObject = {inline_keyboard: []};
	var button, callback
	if(usernameState){
		button = 'Убрать телеграм из анкеты'
		callback = 'remove_username'
	}else{
		button = 'Добавить телеграм в анкету'
		callback = 'add_username'
	}

	replyMarkupObject.inline_keyboard.push([{text: button, callback_data: callback}])

	return JSON.stringify(replyMarkupObject);
}