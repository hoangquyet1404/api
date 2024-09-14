exports.name = '/api/uptime/addMonitor';
exports.index = async (req, res, next) => {
  var name = req.query.name || Date.now();
  var url = req.query.url;
  
  if (!url) {
    return res.json({
      error: 'Thiếu URL!'
    });
  }
  
  var request = require('request');

  var options = {
    method: 'GET', // Sử dụng phương thức GET cho yêu cầu
    url: `https://upty-1-k2477597.deta.app/api/addMonitor?name=${encodeURIComponent(name)}&url=${encodeURIComponent(url)}`,
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/json',
    }
  };

  request(options, function (error, response, body) {
    if (error) return res.json({ error });

    var data = JSON.parse(body);

    if (data.error) {
      return res.json({ error: 'Lỗi, màn hình này đã tồn tại!' });
    }

    return res.json({
      data
    });
  });
};
