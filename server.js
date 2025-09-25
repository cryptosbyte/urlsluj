const cors = require('cors');
require('dotenv').config()

const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL, // e.g. from Upstash
});

client.on('error', (err) => console.error('Redis Client Error', err));  

client.connect().then(() => {
  console.log('Redis connected');
});

const ensureHttps = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

module.exports.server = (app, express) => {
  app.use(cors({ origin: "*" }));
  app.use(express.static("public"));

  app.get("/", (request, response) => 
    response.sendFile(__dirname + "/pages/index.html")
  );

  app.get("/landing", (request, response) => 
    response.sendFile(__dirname + "/pages/landing.html")
  );

  app.post("/api/new", (request, response) => {
    let slug = request.headers.slug;
    let url = request.headers.url;

    client.exists(`urls.${slug}`)
      .then((exists) => {
        if (exists) {
          return response.json({ returned: "404" })
        } else {
          client.set(`urls.${slug}`, ensureHttps(url))
          return response.json({ returned: "done" })
        }
    })
  });


  app.get('/:slug', (request, response) => {
    let { slug } = request.params;

    client.exists(`urls.${slug}`)
      .then((exists) => {
        if (exists) {
          client.get(`urls.${slug}`).then((dbslugurl) => {
            return response.redirect(dbslugurl)
          })
        } else {
          return response.json({ returned: "404" })          
        }
    });
  });
  
  app.get("/api/validate", (request, response) => {
    slug = request.headers.slug
    client.exists(`urls.${slug}`)
      .then((exists) => {
        if (exists) {
          return response.json({ valid: false });      
        } else {
          return response.json({ valid: true });;
        }
    })
  });

  app.get('*', (_, response) => response.redirect('/'));

  app.listen(process.env.PORT);
}