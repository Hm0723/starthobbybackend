const express = require("express");
const router = express.Router();
const { getDB } = require("../db");

router.post("/finalize", async (req, res) => {
  const { email, clawGame, snakeGame, castleGame } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const db = await getDB();

    await db.query(
      `
      INSERT INTO user_game_results
      (email, claw_data, snake_data, castle_data)
      VALUES (?, ?, ?, ?)
      `,
      [
        email,
        JSON.stringify(clawGame),
        JSON.stringify(snakeGame),
        JSON.stringify(castleGame)
      ]
    );

    // 🔮 TEMP response (LLM later)
    res.json({
      personality: "Creative Explorer 🌱",
      hobbies: ["Art journaling", "Baking", "Nature photography"],
      summary: "Your choices show creativity, curiosity and empathy."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save results" });
  }
});

// GET user answers by email (for testing)
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const db = await getDB();
    const [rows] = await db.query(
      'SELECT * FROM user_game_results WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'No results found for email' });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user results by email' });
  }
});

module.exports = router;
