const redis = require('redis');

let client;
if (!client) {
  client = redis.createClient({ url: process.env.REDIS_URL });
  client.on('error', (err) => console.error('Redis error:', err));
  client.connect().then(() => console.log('Redis connected'));
}

const ensureHttps = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Slug,Url');

  const slug = req.headers.slug;
  const url = req.headers.url;

  try {
    const exists = await client.exists(`urls.${slug}`);
    if (exists) {
      return res.json({ returned: "404" });
    } else {
      await client.set(`urls.${slug}`, ensureHttps(url));
      return res.json({ returned: "done" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Redis error');
  }
};
