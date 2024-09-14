const axios = require('axios');

exports.name = '/tw/download';

exports.index = async (req, res, next) => {
  try {
    const url = req.query.url; // Giả sử URL được truyền qua query parameter
    if (!url) {
      return res.status(400).json({ error: 'Không có URL nào được cung cấp' });
    }
    
    const result = await downloadv1(url);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

async function downloadv1(url) {
  try {
    if (typeof url !== 'string') {
      return { found: false, error: 'URL phải là một chuỗi' };
    }
    
    if (!/twitter\.com|x\.com/.test(url)) {
      return { found: false, error: `URL không hợp lệ: ${url}` };
    }
    
    const apiURL = url.replace(/twitter\.com|x\.com/g, 'api.vxtwitter.com');
    const response = await axios.get(apiURL);
    const result = response.data;
    
    if (!result.media_extended) {
      return { found: false, error: 'Không tìm thấy phương tiện nào' };
    }
    
    return {
      type: result.media_extended[0].type,
      media: result.mediaURLs,
      title: result.text || 'Không có tiêu đề',
      id: result.conversationID,
      date: result.date,
      likes: result.likes,
      replies: result.replies,
      retweets: result.retweets,
      author: result.user_name,
      username: result.user_screen_name
    };
  } catch (error) {
    return { found: false, error: error.message };
  }
}

module.exports = {
  name: exports.name,
  index: exports.index
};