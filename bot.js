var router = require('./router.js');
var socBot = require('./modules/bot-api.js');
var reloadThread = require('./modules/thread-cache.js').reloadThread

var context = {
	config: require('./config/config.js'),
	commands: require('./config/commands.js'),
	storage: require("node-persist"),
	log: {}, //winston
	request: require("request-promise")
};

setTimeout(function run() {
	reloadThread(context);
	//console.log('thread has been loaded')
	setTimeout(run, 5000);
}, 5000);

try {
	context.storage.initSync({dir: 'db'});
	context.bot = new socBot(context);
	context.bot.on('text', function (message) {
		router.handle(context, message);
	});
	context.bot.on('callback_query', function (message) {
		router.handleCallback(context, message);
	});

} catch (err) {
	console.log(err)
}

process.on('SIGINT', function () {
	console.log('Bot has stopped');
	process.exit(0);
});

console.log('Bot has started');
console.log('Press [CTRL + C] to stop');