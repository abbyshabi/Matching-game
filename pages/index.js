import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import MemoryGame  from "./MemoryGame";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [highScore, setHighScore] = useState(0);
  const [options, setOptions] = useState(null);

  function reset() {
    window.location.reload();
  }

  return (
    <section className="container">
      <div className="left">
        <h3> Welcome to the Memory Game</h3>
        <label> Name:</label>
        <input
          className="name"
          name="userName"
          placeholder="Enter your name"
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      {/* <div className="middle">
        <img src="https://www.pinclipart.com/picdir/middle/1-17579_free-stock-photos-cartoon-arrow-clip-art-png.png" />
      </div> */}
      {userName ? (
        <div className="right">
          <div>
            <p>
              {" "}
              Hello <b>{userName}</b>, Please select difficulty level
            </p>
            <button className="difficulty" onClick={() => setOptions(12)}>
              Easy
            </button>
            <button className="difficulty" onClick={() => setOptions(18)}>
              Medium
            </button>
            <button className="difficulty" onClick={() => setOptions(24)}>
              Hard
            </button>
          </div>
          {options ? (
            <Popup
              open={options}
              className="popup-content"
              closeOnDocumentClick
              close={() => setOptions(null)}
            >
              <MemoryGame
                options={options}
                setOptions={setOptions}
                highScore={highScore}
                setHighScore={setHighScore}
                userName={userName}
                onComplete={(score) => {
                  // Handle game completion here if needed
                  console.log("Game Completed with score:", score);
                }}
              />
            </Popup>
          ) : (
            <button className="play-button" onClick={() => setOptions(true)}>
              Play
            </button>
          )}
        </div>
      ) : (
        <div className="right">
          <h3>Please enter your user name</h3>
        </div>
      )}
    </section>
  );
}
