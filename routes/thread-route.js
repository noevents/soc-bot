var inlineButtons = require('../config/inline-buttons.js');
var htmlToText = require('html-to-text');
var threadCache = require('../modules/thread-cache.js');
var threadNum;
var thread;
var threadPreview;
var ctx = null;

module.exports = {
	handle: function (_ctx, message) {
		loadCache()
		ctx = _ctx;
		var user = ctx.storage.getItemSync('user-' + message.from.id)
		sendThread(ctx, user, 'Анкеты из овощного');
		//sendThread(ctx, user, 'soc thread');
	},

	handleCallback: function (_ctx, message) {
		loadCache()
		ctx = _ctx;
		var user = ctx.storage.getItemSync('user-' + message.from.id);
		if(!isNaN(message.data)){
			sendThread(ctx, user, null, message.data);
		}else{
			sendThread(ctx, user, 'Анкеты из овощного', message.data);
		}
	}
};

function sendThread(ctx, user, response, button) {
	var _response = (response == null) ? getPost(button) : response //response = null when post needed
	var _user = user
	threadPage = getReplyMarkups_thread(_user, button)				//getting page or post markup
	if(threadPage.numOfFirstPostOnPage != null){
		_user.session.threadPosition = threadPage.numOfFirstPostOnPage
	}
	if(button == null){
		ctx.bot.sendMessage(_user.id, _response, {
			reply_markup: JSON.stringify({inline_keyboard: threadPage.replyMarkupArray}) 
		})
		.then(function(result){
			_user.session.editableMessageId = result.message_id
		})
	}else{
		ctx.bot.editMessageText(_response, {
			chat_id: user.id,
			message_id: _user.session.editableMessageId,
			reply_markup: JSON.stringify({inline_keyboard: threadPage.replyMarkupArray}) 
		})
	}
	
	_user.session.route = 'thread'
	ctx.storage.setItem('user-' + user.id, _user);

}

function getReplyMarkups_thread(user, callBackData) {	//constructing thread page
	threadPreview = threadCache.getThreadPreview()
	var data = {
		numOfFirstPostOnPage: null,
		replyMarkupArray: []
	}
	if(!isNaN(callBackData)){
		data.replyMarkupArray = inlineButtons.postLink(threadNum, callBackData)
	}else {
		pageStartsWith = getStartPosition(user.session.threadPosition, callBackData)
		console.log(pageStartsWith)
		for (var i = 0; i <= 7; i++) {
			data.replyMarkupArray.push([
				{ text: String(threadPreview[pageStartsWith+i]), callback_data: String(thread[pageStartsWith+i].num)}
			]);
		}
		data.replyMarkupArray.push(inlineButtons.threadNav)
		data.numOfFirstPostOnPage = thread[pageStartsWith].num
	}
	return data;
}

function loadCache(){
	thread = threadCache.getThread()
	threadPreview = threadCache.getThreadPreview()
	threadNum = threadCache.getThreadNum()
}

function getStartPosition(positionFromSession, buttn){
	var position
	if(positionFromSession == null){
		position = 1
	}else{
		for (position = 0; position<thread.length; position++) {
			if (thread[position].num == positionFromSession) break;
		}
		switch(buttn) {
			case 'prev':
				position = position-8
				position = (position <= 0) ? 1 : position
				break
			case 'next':
				position = position+8
				position = (position >= thread.length-8) ? thread.length-8 : position
				break
			case 'bottom':
				position = thread.length-8
				break
			case 'top':
				position = 1
				break
			case 'back':
				position = position
				break
		}
	}
	return position
}

function getPost(postNum){	//getting post from chashed thread
	var post
	for(var key = 0; key<thread.length; key++){
		if (postNum == thread[key].num){
			post = thread[key].comment
		}
	}
	return post
}