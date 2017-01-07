var router = require('./router.js');
var socBot = require('./modules/bot-api.js');
var Promise = require("bluebird");
var request = require("request");
Promise.promisifyAll(request);


var context = {
	config: require('./config/config.js'),
	commands: require('./config/commands.js'),
	storage: {}, //node-persist
	log: {}, //winston
	request: request.getAsync
};

try {
	context.bot = new socBot(context);
	context.bot.on('text', function (message) {
		router.handle(context, message);
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