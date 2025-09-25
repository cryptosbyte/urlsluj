const redis = require('redis');

let client;
if (!client) {
  client = redis.createClient({ url: process.env.REDIS_URL });
  client.on('error', (err) => console.error('Redis error:', err));
  client.connect().then(() => console.log('Redis connected'));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Slug,Url');

  const slug = req.query.slug;

  try {
    const exists = await client.exists(`urls.${slug}`);
    if (exists) {
      const url = await client.get(`urls.${slug}`);
      return res.redirect(url);
    } else {
      return res.status(404).json({ returned: "404" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Redis error');
  }
};
