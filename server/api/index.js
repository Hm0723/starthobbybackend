require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const quizRoutes = require("../routes/quizRoutes");
const postRoutes = require("../routes/postRoutes");
const hobbyGameRoutes = require("../routes/hobbyGameRoutes");
const userRoutes = require("../routes/userRoutes");
const commentRoutes = require("../routes/commentRoutes");
const likeRoutes = require("../routes/likeRoutes");
const bookmarkRoutes = require("../routes/bookmarkRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const followRoutes = require("../routes/followRoutes");
const authRoutes = require("../routes/authRoutes");
const aiProfileRoutes = require("../routes/aiProfileRoutes");

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000",           // local frontend
  "https://start-hobby.vercel.app"   // production frontend
];

// ✅ CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      console.log('CORS request from:', origin);
      if (!origin) return callback(null, true); // allow Postman/curl
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ JSON parser
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("StartHobby API is running 🚀");
});

// ✅ API routes (no /api prefix since Vercel routes /api/* here)
app.use("/quizzes", quizRoutes);
app.use("/posts", postRoutes);
app.use("/hobby-game", hobbyGameRoutes);
app.use("/users", userRoutes);
app.use("/comments", commentRoutes);
app.use("/likes", likeRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/notifications", notificationRoutes);
app.use("/follows", followRoutes);
app.use("/auth", authRoutes);
app.use("/ai-profile", aiProfileRoutes);
app.use("/results", require("../routes/results"));

module.exports = app;
