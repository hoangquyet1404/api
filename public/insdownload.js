const axios = require('axios');
exports.name = '/instagram/download';

exports.index = async (req, res) => {
  const { link } = req.query;

  if (!link || typeof link !== 'string' || !link.trim()) {
    return res.status(400).json({ error: "Link is required and must be a non-empty string" });
  }

  async function download(link) {
    //  'wd=600x1153; mid=ZoTOyAALAAEP2pC14FT_nPOKtMgV; ig_did=D5F18322-A0BF-45E1-A66D-ED08BFA5ED3E; datr=yM6EZtQko-OSwboElhfm0T3_; ig_nrcb=1; csrftoken=vis75yhD4PgqjPIIpZ0UjGCYyY9UIInc; ds_user_id=67570554512;sessionid=67570554512%3AFMZLH8xLvehtDc%3A4%3AAYcOUf7mrwlnKR2TNPBcz7po7S487PhuYuNqKJ0GSQ;ps_n=1;ps_l=1;rur="CCO\05467570554512\0541751553996:01f744a347539f48ce52b8d5d280fe5fb8afd42bda212c11fdcdfff88ed89f3e1f69eb43";useragent=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNS4wLjAuMCBTYWZhcmkvNTM3LjM2;_uafec=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F125.0.0.0%20Safari%2F537.36;'; // Thay cookie của bạn ở đây
    const cookie = 'wd=600x1153; mid=ZoTOyAALAAEP2pC14FT_nPOKtMgV; ig_did=D5F18322-A0BF-45E1-A66D-ED08BFA5ED3E; datr=yM6EZtQko-OSwboElhfm0T3_; ig_nrcb=1; csrftoken=vis75yhD4PgqjPIIpZ0UjGCYyY9UIInc; ds_user_id=67570554512; sessionid=67570554512%3AFMZLH8xLvehtDc%3A4%3AAYcOUf7mrwlnKR2TNPBcz7po7S487PhuYuNqKJ0GSQ; ps_n=1; ps_l=1; rur="CCO,67570554512,1751553996:01f744a347539f48ce52b8d5d280fe5fb8afd42bda212c11fdcdfff88ed89f3e1f69eb43"; useragent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36; _uafec=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F125.0.0.0%20Safari%2F537.36;';

    function formatNumber(number) {
      if (isNaN(number)) {
        return null;
      }
      return number.toLocaleString('de-DE');
    }

    async function getPost(url, cookie) {
      const headers = {
        "accept": "*/*",
        "accept-language": "vi,en-US;q=0.9,en;q=0.8",
        "sec-ch-ua": "\"Chromium\";v=\"106\", \"Microsoft Edge\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-asbd-id": "198387",
        "x-csrftoken": "YOUR_CSRFTOKEN_HERE",
        "x-ig-app-id": "936619743392459",
        "x-ig-www-claim": "hmac.AR1NFmgjJtkM68KRAAwpbEV2G73bqDP45PvNfY8stbZcFiRA",
        "x-instagram-ajax": "1006400422",
        "Referer": "https://www.instagram.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "cookie": cookie
      };

      if (!url.match(/https:\/\/www\.instagram\.com\/(p|tv|reel)\/[a-zA-Z0-9]+/)) {
        throw new Error("Invalid or missing URL");
      }

      const { data } = await axios.get(url, { headers });
      const postId = data.match(/instagram:\/\/media\?id=(\d+)/)?.[1];
      if (!postId) throw new Error("Post not found");

      const { data: postInfo } = await axios.get(`https://www.instagram.com/api/v1/media/${postId}/info/`, { headers });
      const info = postInfo.items?.[0] || {};
      const attachments = [];

      if (info.video_versions) {
        attachments.push(...info.video_versions.map(video => ({ type: "Video", url: video.url })));
      } else {
        // Kiểm tra kỹ sự tồn tại của `image_versions2` và `candidates`
        const allImages = info.carousel_media || [{ image_versions2: info.image_versions2 }];
        attachments.push(
          ...allImages.map(image => {
            if (image.image_versions2 && image.image_versions2.candidates) {
              return { type: "Photo", url: image.image_versions2.candidates[0].url };
            }
            return null; // Nếu không có ảnh thì bỏ qua
          }).filter(Boolean) // Loại bỏ các phần tử `null`
        );
      }

      return {
        id: info.id,
        caption: info.caption?.text || "",
        owner: {
          id: info.user.pk,
          username: info.user.username,
          full_name: info.user.full_name,
          profile_pic_url: info.user.profile_pic_url
        },
        like_count: formatNumber(info.like_count),
        comment_count: formatNumber(info.comment_count),
        media_type: info.media_type,
        attachments
      };
    }

    if (/https:\/\/www\.instagram\.com\/(p|tv|reel)\/[a-zA-Z0-9]+/.test(link)) {
      return await getPost(link, cookie);
    }
  }

  try {
    const result = await download(link);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
