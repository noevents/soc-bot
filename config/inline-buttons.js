module.exports = {
	threadNav: [
		{
			text: 'в начало',
			callback_data: 'top'
		},
		{
			text: 'в конец',
			callback_data: 'bottom'
		},
		{
			text: '←',
			callback_data: 'prev'
		},
		{
			text: '→',
			callback_data: 'next'
		}
	],
	postLink: function (threadNum, postNum) {
		return [[{ text: 'Ссылка на пост', url: "http://2ch.hk/soc/res/"+threadNum+".html#"+postNum }],
				[{ text: 'Назад', callback_data: "back" }]]
	}
}