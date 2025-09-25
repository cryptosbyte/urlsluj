const db = require('quick.db'),
  cors = require('cors');

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

    if (db.get(`urls.${slug}`)) return response.json({ returned: "404" })
    else {
      db.set(`urls.${slug}`, url);
      return response.json({ returned: "done" });
    }
  });

  app.get('/:slug', (request, response) => {
    let { slug } = request.params;
    let dbslugurl = db.get(`urls.${slug}`);
    
    if (dbslugurl) return response.redirect(dbslugurl)
  });
  
  app.get("/api/validate", (request, response) => {
    if (db.get(`urls.${request.headers.slug}`)) return response.json({ valid: false });
    return response.json({ valid: true });;
  });

  app.get('*', (_, response) => response.redirect('/'));

  app.listen(process.env.PORT);
}