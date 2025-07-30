import React, { useEffect, useState } from "react";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";
import winSoundFile from "./assets/win.mp3";
import loseSoundFile from "./assets/lose.mp3";
import './App.css';

const choices = [
  { name: "rock", icon: <FaHandRock /> },
  { name: "paper", icon: <FaHandPaper /> },
  { name: "scissors", icon: <FaHandScissors /> },
];

const getWinner = (user, computer) => {
  if (user === computer) return "tie";
  if (
    (user === "rock" && computer === "scissors") ||
    (user === "paper" && computer === "rock") ||
    (user === "scissors" && computer === "paper")
  ) {
    return "user";
  }
  return "computer";
};

function App() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showWinner, setShowWinner] = useState(false);
  const [matchWinner, setMatchWinner] = useState("");
  const [matchHistory, setMatchHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const winSound = new Audio(winSoundFile);
  const loseSound = new Audio(loseSoundFile);

  useEffect(() => {
    const storedMode = JSON.parse(localStorage.getItem("darkMode"));
    if (storedMode !== null) {
      setDarkMode(storedMode);
    }
  }, []);

  const handleClick = (choice) => {
    if (userScore === 2 || computerScore === 2) return;

    const randomChoice = choices[Math.floor(Math.random() * 3)].name;
    setUserChoice(choice);
    setComputerChoice(randomChoice);
    const winner = getWinner(choice, randomChoice);

    if (winner === "user") {
      setUserScore((prev) => prev + 1);
    } else if (winner === "computer") {
      setComputerScore((prev) => prev + 1);
    }

    setRound((prev) => prev + 1);

    if (
      (userScore + 1 === 2 && winner === "user") ||
      (computerScore + 1 === 2 && winner === "computer")
    ) {
      setTimeout(() => {
        const finalWinner =
          winner === "user" ? "You win the match!" : "Computer wins the match!";
        setMatchWinner(finalWinner);
        setShowWinner(true);

        if (winner === "user") winSound.play();
        if (winner === "computer") loseSound.play();

        setMatchHistory((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            winner: finalWinner,
            userScore: userScore + (winner === "user" ? 1 : 0),
            computerScore: computerScore + (winner === "computer" ? 1 : 0),
          },
        ]);
      }, 500);
    }
  };

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setUserScore(0);
    setComputerScore(0);
    setRound(1);
    setShowWinner(false);
    setMatchWinner("");
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="game-title">Rock Paper Scissors (Best of 3)</h1>

      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="round">Round: {round}</div>

      <div className="scoreboard">
        <div>You: {userScore}</div>
        <div>Computer: {computerScore}</div>
      </div>

      <div className="choice-buttons">
        {choices.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => handleClick(name)}
            className="choice-button"
          >
            {icon}
          </button>
        ))}
      </div>

      <div className="choice-display">
        {userChoice && (
          <>
            <p>You chose: <strong>{userChoice}</strong></p>
            <p>Computer chose: <strong>{computerChoice}</strong></p>
          </>
        )}
      </div>

      {showWinner && (
        <div className="overlay">
          <div className="winner-modal">
            <h2 className="winner-text">{matchWinner}</h2>
            <button onClick={resetGame} className="play-again-button">
              Play Again
            </button>
          </div>
        </div>
      )}

      {matchHistory.length > 0 && (
        <div className="history-container">
          <h3 className="history-title">Match History</h3>
          <ul className="history-list">
            {matchHistory.map((match) => (
              <li key={match.id} className="history-item">
                Match #{match.id}: <strong>{match.winner}</strong> (You: {match.userScore}, Computer: {match.computerScore})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
