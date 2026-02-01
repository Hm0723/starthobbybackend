import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SnakeLadderGame.css";

const BOARD_SIZE = 25;
const REQUIRED_QUESTIONS = 5;
const SNAKES = { 14: 4, 19: 8, 22: 20, 24: 16 };
const LADDERS = { 3: 11, 6: 17, 9: 18, 10: 12 };

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://starthobbybackend-production.up.railway.app"
    : "http://localhost:5000";

const SnakeLadderGame = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [diceNum, setDiceNum] = useState(1);
  const [statusMsg, setStatusMsg] = useState("Roll to start!");
  const [modalData, setModalData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerTypes, setAnswerTypes] = useState([]);
  const [miniInsight, setMiniInsight] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const bgSound = useRef(null);
  const clickSound = useRef(null);
  const slideUpSound = useRef(null);
  const slideDownSound = useRef(null);

  const safePlay = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/quizzes/snake`)
      .then((res) => res.json())
      .then((data) => {
        const actualData = Array.isArray(data) ? data : (data.questions || []);
        if (actualData.length > 0) {
          const formatted = actualData.map((q) => ({
            id: q.id,
            q: q.question,
            options: [
              { text: q.option_a, type: "Active" },
              { text: q.option_b, type: "Strategic" },
              { text: q.option_c, type: "Creative" },
              { text: q.option_d, type: "Social" }
            ]
          }));
          setQuestions(formatted.sort(() => Math.random() - 0.5));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    bgSound.current = new Audio("/sounds/SnakeLadder.mp3");
    bgSound.current.loop = true;
    bgSound.current.volume = 0.4;
    bgSound.current.play().catch(() => {});
    clickSound.current = new Audio("/sounds/click.mp3");
    slideUpSound.current = new Audio("/sounds/slideUP.mp3");
    slideDownSound.current = new Audio("/sounds/slideDOWN.mp3");

    return () => bgSound.current?.pause();
  }, []);

  const handleRollDice = () => {
    if (isRolling || modalData || miniInsight || isFinished) return;

    safePlay(clickSound);
    setIsRolling(true);
    setStatusMsg("Rolling...");

    const rollInterval = setInterval(() => {
      setDiceNum(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);

      let targetTile = 1;
      const turnIndex = answers.length;

      // --- STRICT SCRIPTED PATH ---
      if (turnIndex === 0) targetTile = 3;  
      else if (turnIndex === 1) targetTile = 14; 
      else if (turnIndex === 2) targetTile = 9;  
      else if (turnIndex === 3) targetTile = 20; 
      else if (turnIndex === 4) targetTile = 23; 
      else if (turnIndex === 5) targetTile = 25; // 6th Roll: Must hit 25
      else targetTile = 25;

      const diceValue = targetTile - position;
      setDiceNum(diceValue > 0 ? diceValue : 1);
      setPosition(targetTile);

      setTimeout(() => checkTile(targetTile), 800);
    }, 800);
  };

  const checkTile = (currentPos) => {
    if (SNAKES[currentPos]) {
      setStatusMsg("🐍 Oh no! Snake!");
      safePlay(slideDownSound);
      setTimeout(() => {
        setPosition(SNAKES[currentPos]);
        setTimeout(() => { setIsRolling(false); triggerQuestion(); }, 800);
      }, 800);
    } else if (LADDERS[currentPos]) {
      setStatusMsg("🪜 Awesome! Ladder!");
      safePlay(slideUpSound);
      setTimeout(() => {
        setPosition(LADDERS[currentPos]);
        setTimeout(() => { setIsRolling(false); triggerQuestion(); }, 800);
      }, 800);
    } else if (currentPos === BOARD_SIZE) {
      setStatusMsg("You reached the Castle! 🏰");
      setIsRolling(false);
      setIsFinished(true);
      setTimeout(() => calculateMiniInsight(), 1200);
    } else {
      setIsRolling(false);
      triggerQuestion();
    }
  };

  const triggerQuestion = () => {
    if (answers.length < REQUIRED_QUESTIONS) {
      setModalData(questions[answers.length]);
      setStatusMsg("❓ Quick Question!");
    } else {
      setStatusMsg("Final stretch! Reach the Castle!");
    }
  };

  const handleAnswer = (option) => {
    safePlay(clickSound);
    setAnswers([...answers, { q: modalData.q, a: option.text }]);
    setAnswerTypes([...answerTypes, option.type]);
    setModalData(null);
  };

  const calculateMiniInsight = () => {
    const counts = {};
    let maxType = "Creative";
    let maxCount = 0;
    answerTypes.forEach(t => {
      counts[t] = (counts[t] || 0) + 1;
      if (counts[t] > maxCount) { maxCount = counts[t]; maxType = t; }
    });
    const insights = {
      Creative: "You have a vividly Creative mind! 🎨",
      Active: "You seem like an energetic Doer! 🏃",
      Strategic: "I see a sharp, Strategic thinker! 🧠",
      Social: "You are a true People Person! 🤝"
    };
    setMiniInsight(insights[maxType] || "You have a Balanced vibe! ⚖️");
  };

  const gridCells = [];
  for (let r = 4; r >= 0; r--) {
    const isEven = r % 2 === 0;
    for (let c = 0; c < 5; c++) {
      gridCells.push(isEven ? (r * 5) + 1 + c : (r * 5) + 5 - c);
    }
  }

  const getPlayerStyle = () => {
    const row = Math.floor((position - 1) / 5);
    const col = (position - 1) % 5;
    const actualCol = (row % 2 !== 0) ? 4 - col : col;
    return { bottom: `${row * 20}%`, left: `${actualCol * 20}%` };
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="snake-game-container">
      <div className="game-header">
        <div className="progress-bar">
          <div className="fill" style={{ width: `${(answers.length / REQUIRED_QUESTIONS) * 100}%` }}></div>
        </div>
        <p className="status-text">{statusMsg}</p>
      </div>

      <div className="board-wrapper">
        <div className="board-grid">
          {gridCells.reverse().map((num) => (
            <div key={num} className={`tile ${SNAKES[num] ? 'snake-tile' : ''} ${LADDERS[num] ? 'ladder-tile' : ''}`}>
              <span className="tile-num">{num}</span>
              {SNAKES[num] && <span className="marker">🐍</span>}
              {LADDERS[num] && <span className="marker">🪜</span>}
              {num === 25 && <span className="castle-icon">🏰</span>}
            </div>
          ))}
        </div>
        <div className="player-token" style={getPlayerStyle()}>🐿️</div>
      </div>

      <div className="controls-area">
        <div className={`dice-display ${isRolling ? "animate-roll" : ""}`}>{diceNum}</div>
        <button className="roll-btn" onClick={handleRollDice} disabled={isRolling || modalData || isFinished}>
          {isFinished ? "DONE" : "ROLL"}
        </button>
      </div>

      {modalData && (
        <div className="modal-overlay">
          <div className="sl-question-card">
            <h3>{modalData.q}</h3>
            {modalData.options.map((opt, i) => (
              <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>{opt.text}</button>
            ))}
          </div>
        </div>
      )}

      {miniInsight && (
        <div className="modal-overlay">
          <div className="insight-card">
            <h1>Adventure Complete!</h1>
            <h2>{miniInsight}</h2>
            <button className="final-btn" onClick={() => navigate("/finalize")}>Reveal My Hobby</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeLadderGame;