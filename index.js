import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // Vercel needs this