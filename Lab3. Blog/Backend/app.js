const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

require("./database/database");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; object-src 'none';"
  );

  next();
});

app.use("/api", (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  next();
});

app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));

app.listen(3000, () => {
  console.log("API działa na http://localhost:3000");
});
