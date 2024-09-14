const axios = require('axios');
const cheerio = require('cheerio');

exports.name = '/threads/download';

exports.index = async (req, res, next) => {
  // This function is empty and unused. Consider removing it or implementing the logic.
};

async function downloadv1(link) {
  function getIDThread(link) {
    const regex = /\/post\/([^\/]+)\/?/;
    const match = link.match(regex);
    return match && match[1] ? match[1] : null;
  }

  const id = getIDThread(link);
  if (!id) {
    throw new Error('Invalid thread link');
  }

  try {
    const response = await axios.get(`https://data.threadster.site/results/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      }
    });

    const { data } = response.data;
    const results = data.media?.map(media => ({
      type: media.image_url ? 'image' : 'video',
      url: media.image_url || media.video_url
    })) || [];

    return {
      title: data.full_text,
      user: {
        username: data.user.username,
        profile_pic_url: data.user.profile_pic_url
      },
      results
    };
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}

async function downloadv2(url) {
  function formatNumber(number) {
    return isNaN(number) ? null : number.toLocaleString('de-DE');
  }

  try {
    const res = await axios.get(url, {
      headers: {
        // ... (headers remain unchanged)
      }
    });

    if (res.status !== 200) {
      throw new Error(`Status Error: ${res.status} ${res.config.url}`);
    }

    const $ = cheerio.load(res.data);
    const scriptContent = $("script").filter((_, script) => 
      script.children[0]?.data.includes("username") && 
      script.children[0]?.data.includes("original_width")
    ).first().text();

    if (!scriptContent) {
      throw new Error('Required script content not found');
    }

    const parsedData = JSON.parse(scriptContent);
    const dataResponse = parsedData.require[0][3][0].__bbox.require[0][3][1].__bbox.result.data.data.edges[0].node.thread_items[0].post;

    const attachments = [];
    if (dataResponse.video_versions?.length > 0) {
      attachments.push({
        type: 'Video',
        url: dataResponse.video_versions[0].url
      });
    }

    if (dataResponse.carousel_media?.length > 0) {
      dataResponse.carousel_media.forEach(item => {
        if (item.image_versions2?.candidates?.length > 0) {
          attachments.push({
            type: 'Photo',
            url: item.image_versions2.candidates[0].url
          });
        }
        if (item.video_versions?.length > 0) {
          attachments.push({
            type: 'Video',
            url: item.video_versions[0].url
          });
        }
      });
    }

    if (dataResponse.audio?.audio_src) {
      attachments.push({
        type: 'Audio',
        url: dataResponse.audio.audio_src
      });
    }

    return {
      id: dataResponse.pk,
      message: dataResponse.caption?.text || "Không có tiêu đề",
      like_count: formatNumber(Number(dataResponse.like_count)) || 0,
      reply_count: formatNumber(Number(dataResponse.text_post_app_info?.direct_reply_count)) || 0,
      repost_count: formatNumber(Number(dataResponse.text_post_app_info?.repost_count)) || 0,
      quote_count: formatNumber(Number(dataResponse.text_post_app_info?.quote_count)) || 0,
      author: dataResponse.user.username,
      short_code: dataResponse.code,
      taken_at: dataResponse.taken_at,
      attachments
    };
  } catch (error) {
    console.error('Error in downloadv2:', error);
    throw error;
  }
}

module.exports = {
  downloadv1,
  downloadv2
};