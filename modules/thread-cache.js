var inlineButtons = require('../config/inline-buttons.js');
var htmlToText = require('html-to-text');
var CURRENT_THREAD_NUM;
var CURRENT_THREAD_POSTS_COUNT;
var CURRENT_THREAD = [];
var CURRENT_THREAD_PREV = [];

module.exports = {
	getThread: () => CURRENT_THREAD,
	getThreadPreview: () => CURRENT_THREAD_PREV,
	getThreadNum: () => CURRENT_THREAD_NUM,
	reloadThread:  function (_ctx) {
		getJSONThread(_ctx)}
	}

function getJSONThread(ctx){
	var boardOptions = {
		uri: 'http://2ch.hk/soc/index.json',
		json: true
	};
	ctx.request(boardOptions)
		.then(function (board) {
			if(CURRENT_THREAD_NUM != board.threads[0].thread_num || CURRENT_THREAD_POSTS_COUNT != board.threads[0].posts_count){
				CURRENT_THREAD_NUM = board.threads[0].thread_num;
				CURRENT_THREAD_POSTS_COUNT = board.threads[0].posts_count;
				var threadOptions = {
					uri: 'http://2ch.hk/soc/res/'+CURRENT_THREAD_NUM+'.json',
					json: true,
					//resolveWithFullResponse: true
				};
				ctx.request(threadOptions)
					.then(function (thread){
						for(var key = 0; key<thread.threads[0].posts.length; key++){
							CURRENT_THREAD[key] = {
								num: thread.threads[0].posts[key].num,
								comment: thread.threads[0].posts[key].comment
							}
						}
						parseThread(CURRENT_THREAD, CURRENT_THREAD_NUM)
					})
			}
		})
		.catch(function (err) {
			console.log('REQUEST ERROR', err)
		});
}

function parseThread(thread, thread_num){
	for (var key = 0; key<thread.length; key++) {
		var text = htmlToText.fromString(thread[key].comment, {
			ignoreHref: true
		})
		text = text.split("\n");
		var message_prev = "";
		var message = "";
		text.forEach(function(item, i, text) {
			if (item != ">>"+thread_num+" (OP)"){
				message_prev = message_prev+" "+item;
				message = message+"\n"+item;
			}
		})
		CURRENT_THREAD_PREV[key] = message_prev;
		CURRENT_THREAD[key].comment = message;
	}
}