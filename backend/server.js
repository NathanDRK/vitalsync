const express = require("express");

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok", commit: "feature-add-endpoint", timestamp: new Date() });
});

// Route ajoutée pour correspondre au front via /api/*
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.get("/api/activities", (req, res) => {
  res.json([]);
});

app.get("/api/ping", (req, res) => {
  res.json({ pong: true });
});

app.listen(3000, () => console.log("VitalSync API on :3000"));

