exports.name = '/images/hentai';
exports.index = async(req, res, next) => {
    try {
        const girl = require('./images/data/json/hentai.json');
        var image = girl[Math.floor(Math.random() * girl.length)].trim();
        res.jsonp({
            url: image,
            count: girl.length,
            author: 'TuanDeepTry'
        });
    } catch (e) {
        return res.jsonp({ error: e });
    }
}