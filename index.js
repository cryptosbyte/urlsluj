const express = require("express");
const cors = require("cors");
require("dotenv").config();
const redis = require("redis");
const path = require("path");

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => console.error("Redis Client Error", err));

client.connect().then(() => {
  console.log("Redis connected");
});

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json()); 

const ensureHttps = (url) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
};

app.use(express.static("public"));
app.use(express.static("pages"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.get("/landing", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "landing.html"));
});

app.post("/api/new", async (req, res) => {
  const slug = req.headers.slug;
  const url = req.headers.url;

  if (!slug || !url) {
    return res.status(400).json({ error: "Missing slug or url" });
  }

  const key = `urls.${slug}`;
  const exists = await client.exists(key);

  if (exists) {
    return res.json({ returned: "404" });
  } else {
    await client.set(key, ensureHttps(url));
    return res.json({ returned: "done" });
  }
});

app.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const key = `urls.${slug}`;
  const exists = await client.exists(key);

  if (exists) {
    const dbslugurl = await client.get(key);
    return res.redirect(dbslugurl);
  } else {
    return res.status(404).json({ returned: "404" });
  }
});

app.get("/api/validate", async (req, res) => {
  const slug = req.headers.slug;
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  const exists = await client.exists(`urls.${slug}`);
  return res.json({ valid: exists ? false : true });
});

app.get("*", (req, res) => {
    if (!req.url.endsWith('/icon/icon.png')) {
    res.redirect("/")}
    }
);

export default app