exports.name = '/game/vuatiengviet';
exports.index = async(req, ress, next) => {
    try {
        const data = require('./datawords.json');
	const rdWords = data[Math.floor(Math.random() * data.length)]
        ress.json({
            keyword: rdWords.text,
            author: 'R1zaX'
        })
    } catch (error) {

    }
}