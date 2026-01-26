import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://starthobbybackend-production.up.railway.app"
    : "http://localhost:5000";

const FinalizeResults = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  /* =========================
     1️⃣ COLLECT & CLEAN DATA
  ========================= */
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") || "";
    setEmail(storedEmail);

    const raw = localStorage.getItem("gameResults");
    const gameResults = raw ? JSON.parse(raw) : {};

    const cleaned = [];

    // 🎮 Claw Game
    if (gameResults.clawGame?.answers) {
      gameResults.clawGame.answers.forEach((item) => {
        cleaned.push({
          game: "claw",
          question: item.question,
          answer: item.answer,
        });
      });
    }

    // 🎲 Snake & Ladder
    if (gameResults.snakeGame?.answers) {
      gameResults.snakeGame.answers.forEach((item) => {
        cleaned.push({
          game: "snake",
          question: item.q,
          answer: item.a,
        });
      });
    }

    // 🏰 Castle Game
    if (gameResults.castleGame?.choices) {
      gameResults.castleGame.choices.forEach((choice, index) => {
        cleaned.push({
          game: "castle",
          question: choice.question,
          answer: choice.answer,
        });
      });
    }

    setResponses(cleaned);
    setLoading(false);
  }, []);

  /* =========================
     2️⃣ SUBMIT TO BACKEND / LLM
  ========================= */
  const handleFinalize = async () => {
    if (!email) {
      alert("Email missing. Please restart from Home.");
      return;
    }

    try {
      await fetch(`${API_BASE}/api/results/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          responses,
        }),
      });

      setSubmitted(true);

      // Optional: clean up session data
      // localStorage.removeItem("gameResults");

      setTimeout(() => navigate("/personality-reveal"), 1200);
    } catch (err) {
      console.error("Finalize failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  /* =========================
     UI
  ========================= */
  if (loading) {
    return (
      <div style={pageStyle}>
        <h2>Finalizing your adventure...</h2>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1>✨ Finalizing Your Adventure</h1>
        <p>Your hobby profile is being prepared 🎒</p>

        <pre style={codeStyle}>
          {JSON.stringify({ email, responses }, null, 2)}
        </pre>

        {!submitted ? (
          <button style={btnStyle} onClick={handleFinalize}>
            Confirm & Continue
          </button>
        ) : (
          <p style={{ marginTop: 20 }}>Redirecting...</p>
        )}
      </div>
    </div>
  );
};

/* =========================
   STYLES (INLINE, SIMPLE)
========================= */
const pageStyle = {
  minHeight: "100vh",
  background: "#1f3d1f",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};

const cardStyle = {
  background: "#2d4a2d",
  padding: "40px",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "520px",
  textAlign: "center",
};

const codeStyle = {
  background: "#000",
  padding: "16px",
  marginTop: "20px",
  maxHeight: "300px",
  overflowY: "auto",
  textAlign: "left",
  fontSize: "12px",
  borderRadius: "8px",
};

const btnStyle = {
  marginTop: "24px",
  padding: "14px 32px",
  fontSize: "16px",
  borderRadius: "999px",
  background: "#6bcb77",
  border: "none",
  cursor: "pointer",
  fontWeight: "700",
};

export default FinalizeResults;
