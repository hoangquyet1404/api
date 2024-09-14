const axios = require('axios');
exports.name = '/capcut/info';

exports.index = async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: "Url is required and must be a non-empty string" });
  }

  try {
    // Determine which function to use based on the url
    const result = url.includes('capcut.com/profile') ? await post(url) : await info(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function info(url) {
    try {
        const getUrl = await axios.get(url);
        const get = getUrl.request.res.responseUrl;
        const urls = get.split("=")[1].split("&")[0];
        if (!urls) {
            throw new Error("Không thể trích xuất URL từ phản hồi");
        }        
        const data = {
            'public_id': urls
        };        
        const options = {
            method: 'POST',
            url: 'http://feed-api.capcutapi.com/lv/v1/homepage/profile',
            data: data,
            headers: {
                'Connection': 'keep-alive',
                'Content-Length': Buffer.byteLength(JSON.stringify(data)),
                'Accept-Language': 'vi-VN,vi;q=0.9',
                'Referer': 'https://mobile.capcutshare.com/',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
                'Origin': 'https://mobile.capcutshare.com',
                'Host': 'feed-api.capcutapi.com',
                'pf': '1',
                'app-sdk-version': '100.0.0',
                'sign': '279ff6779bd2bb1684e91d411499ee79',
                'loc': 'BR',
                'sign-ver': '1',
                'device-time': '1699453732',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Dest': 'empty',
                'Content-Type': 'application/json'
            }
        };       
        const response = await axios.request(options);
        const userData = response.data.data;
        return userData;
    } catch (error) {
        throw new Error("Error occurred:", error);
    }
}

async function post(url){
  const extractId = (url) => {
  const regex = /^https:\/\/www\.capcut\.com\/profile\/([a-zA-Z0-9]+)(\?.*)?$/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  } else {
    return;
  }
};
  const id = extractId(url);
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'vi,en;q=0.9',
    'App-Sdk-Version': '48.0.0',
    'Appvr': '5.8.0',
    'Content-Type': 'application/json',
    'Cookie': 'passport_csrf_token=fea6749fed6008d79372ea4131efb483; passport_csrf_token_default=fea6749fed6008d79372ea4131efb483; passport_auth_status=6f01e86273e10de44e9a2ea3891f1a25%2C; passport_auth_status_ss=6f01e86273e10de44e9a2ea3891f1a25%2C; sid_guard=8437e2a5e8f43d0bcc46bf26aa479ae5%7C1717844956%7C34560000%7CSun%2C+13-Jul-2025+11%3A09%3A16+GMT; uid_tt=e34ead5d420362c0e3d71761308ff9c74276f6e50a2a774c217bcf2320b46658; uid_tt_ss=e34ead5d420362c0e3d71761308ff9c74276f6e50a2a774c217bcf2320b46658; sid_tt=8437e2a5e8f43d0bcc46bf26aa479ae5; sessionid=8437e2a5e8f43d0bcc46bf26aa479ae5; sessionid_ss=8437e2a5e8f43d0bcc46bf26aa479ae5; sid_ucp_v1=1.0.0-KGI2YTQ3YzBhMjZlNWQ1NGYwZjhmZThlNTdlNzQ3NzgxOGFlMGE0MzEKIAiCiIqEifaqymUQ3PeQswYYnKAVIAww29fSrAY4CEASEAMaA3NnMSIgODQzN2UyYTVlOGY0M2QwYmNjNDZiZjI2YWE0NzlhZTU; ssid_ucp_v1=1.0.0-KGI2YTQ3YzBhMjZlNWQ1NGYwZjhmZThlNTdlNzQ3NzgxOGFlMGE0MzEKIAiCiIqEifaqymUQ3PeQswYYnKAVIAww29fSrAY4CEASEAMaA3NnMSIgODQzN2UyYTVlOGY0M2QwYmNjNDZiZjI2YWE0NzlhZTU; store-idc=alisg; store-country-code=vn; store-country-code-src=uid; _clck=gewwr2%7C2%7Cfmg%7C0%7C1620; _ga=GA1.1.1507227716.1717848785; _uetsid=8d048170258711efb10015e2f330cee7; _uetvid=8d04cee0258711ef8d278993f44c7fbe; odin_tt=7a1936766b075bcdd15ca040e2d926418c4a911445b5737a4e978efb10e1aed16e9b08365d3a44762209e1adeed01632a30a6b7c37e731b58a092147efb9ba5c; _clsk=1wijwf4%7C1717867543424%7C3%7C0%7Ct.clarity.ms%2Fcollect; msToken=1V8bYwi-_XjwdZIf77jcwuV-13xancdZ5bPQDSCe0nTOgB6cIvyGTWSuMCmAm7cSaDihaE2s50ttXzJbm1d6m22XAJS4dc5KvF1MgCJLpDynxt8C4JHYDuqyhGEpoHOF8AdUbw==; ttwid=1|lzYqbBKYnM2qubxO7orNtAxCXMz3BbnaAMgB-zy4ICY|1717867562|f760193d3026b69a6c6b6dcc54da822c6a83c832451d0d00e50ebe5632b3b8d6; _ga_F9J0QP63RB=GS1.1.1717867508.4.1.1717867563.0.0.0',
    'Device-Time': '1717867567',
    'Lan': 'vi-VN',
    'Loc': 'va',
    'Origin': 'https://www.capcut.com',
    'Pf': '7',
    'Priority': 'u=1, i',
    'Referer': 'https://www.capcut.com/',
    'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'Sign': '3eb8d0cc0725a849d395c56b1d5ae44b',
    'Sign-Ver': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  };
  const json = {
   "cursor": "0",
   "count": 20,
   "uid": "",
   "public_id": id,
   "status_list": [],
   "template_type_list": [1]
};
  try {
    const response = await axios.post(`https://edit-api-sg.capcut.com/lv/v1/cc_web/homepage/profile/templates`, json, { headers });
    const medias = [];
    const data = response.data.data.templates;
    data.forEach(item => {
      const media = {
        id: item.web_id,
        title: item.title,
        short_title: item.short_title,
        author: {
          unique_id: item.author.unique_id,
          name: item.author.name
        },
        duration: item.duration,
        like_count: item.like_count,
        play_amount: item.play_amount,
        usage_amount: item.usage_amount,
        fragment_count: item.fragment_count,
        comment_count: item.interaction.comment_count,
        create_time: item.create_time,
        video_url: item.video_url,
      };
      medias.push(media);
    });
    return medias;
  } catch (error) {
    throw new Error(`Error fetching profile data: ${error.message}`);
  }
};
