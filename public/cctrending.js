const axios = require('axios');

exports.name = '/capcut/trending';

exports.index = async (req, res) => {
  try {
    const trendingData = await trending();
    res.json(trendingData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function trending() {
    const randomPage = Math.floor(Math.random() * 3);
    const options = {
        method: 'GET',
        url: `https://ssscap.net/api/trending?page=${randomPage}`,
        headers: {
            'authority': 'ssscap.net',
            'accept': '*/*',
            'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'cookie': '__gads=ID=03431c20aa7b82e4:T=1704100049:RT=1704100049:S=ALNI_MbE1NkGBiFXQe8EUpVgsmCNZ0mJVA; __gpi=UID=00000cce585c8964:T=1704100049:RT=1704100049:S=ALNI_MaI4WwEuvI8Uh3mBXwYyFOBZjj4Fw; FCNEC=%5B%5B%22AKsRol89woXfNWJs4u6AZxkFpWeTzMQkqVPf5E6C6U5UqaW7PtWzZdtx-D5KPNAEKHnbRwJbpcMiOMgfwV6XnBjv-lUHvQTKQpM7Yd_AglzSPP_v7x-EBkqX_7OxnJhCqriVCpfhhe23-KhDiFBVuvx0Jfr8WFxrPg%3D%3D%22%5D%5D; sign=936a82e9336542a58828d17ecd2e897c; device-time=1704100333392',
            'if-none-match': 'W/"113g0xmp3wq4ko"',
            'referer': 'https://ssscap.net/capcut-template',
            'sec-ch-ua': 'Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    };
    try {
        const response = await axios.request(options);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch trending data from ssscap.net');
    }
}