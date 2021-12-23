import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { useSpring, animated as a } from "react-spring"; 


export default function Home() {
  const [ userName, setUserName ] = useState("");
  const [ highScore, setHighScore ] = useState(0);
  const [ options, setOptions ] = useState(null);

  return (
    <section className='container'>
      <div className='left'>
        <h3> Welcome to the Memory Game</h3>
        <label> Name:</label>
        <input
          className='name'
          name='userName'
          placeholder='Enter your name'
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className='middle'>
        <img src='https://www.pinclipart.com/picdir/middle/1-17579_free-stock-photos-cartoon-arrow-clip-art-png.png' />
      </div>
      {userName ? (
        <div className='right'>
          <div>
            <p>
              {" "}
              Hello <b>{userName}</b>, Please select difficulty level
            </p>
            <button className='difficulty' onClick={() => setOptions(12)}>
              Easy
            </button>
            <button className='difficulty' onClick={() => setOptions(18)}>
              Medium
            </button>
            <button className='difficulty' onClick={() => setOptions(24)}>
              Hard
            </button>
          </div>
          <button className='play-button'>Play</button>
          {options ? (
            <Popup open={options} className="popup-content">
              {" "}
              {console.log(options, highScore, userName)}
              <MemoryGame
                options={options}
                setOptions={setOptions}
                highScore={highScore}
                setHighScore={setHighScore}
                userName={userName}
              />
            </Popup>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className='right'>
          <h3>Please enter your user name</h3>
        </div>
      )}
      {console.log(userName)}
    </section>
  );
}

function MemoryGame({options, setOptions, highScore, setHighScore, userName}) {
  const [game, setGame] = useState([])
  const [flippedCount, setFlippedCount] = useState(0)
  const [flippedIndexes, setFlippedIndexes] = useState([])

  const colors = [
    '#ecdb54',
    '#e34132',
    '#6ca0dc',
    '#944743',
    '#dbb2d1',
    '#ec9787',
    '#00a68c',
    '#645394',
    '#6c4f3d',
    '#ebe1df',
    '#bc6ca7',
    '#bfd833',
  ]

  useEffect(() => {
    const newGame = []
    for (let i = 0; i < options / 2; i++) {
      const firstOption = {
        id: 2 * i,
        colorId: i,
        color: colors[i],
        flipped: false,
      }
      const secondOption = {
        id: 2 * i + 1,
        colorId: i,
        color: colors[i],
        flipped: false,
      }

      newGame.push(firstOption)
      newGame.push(secondOption)
    }

    const shuffledGame = newGame.sort(() => Math.random() - 0.5)
    setGame(shuffledGame)
  }, [])

  useEffect(() => {
    const finished = !game.some(card => !card.flipped)
    if (finished && game.length > 0) {
      setTimeout(() => {
        const bestPossible = game.length
        let multiplier
  
        if (options === 12) {
          multiplier = 5
        } else if (options === 18) {
          multiplier = 2.5
        } else if (options === 24) {
          multiplier = 1
        }
  
        const pointsLost = multiplier * (0.66 * flippedCount - bestPossible)
  
        let score
        if (pointsLost < 100) {
          score = 100 - pointsLost
        } else {
          score = 0
        }
  
        if (score > highScore) {
          setHighScore(score)
          const json = JSON.stringify(score)
          localStorage.setItem('memorygamehighscore', json)
        }
  
        const newGame = confirm('You Win!, SCORE: ' + score + ' New Game?')
        if (newGame) {
          const gameLength = game.length
          setOptions(null)
          setTimeout(() => {
            setOptions(gameLength)
          }, 5)
        } else {
          setOptions(null)
        }
      }, 500)
    }
  }, [game])
  

  if (flippedIndexes.length === 2) {
    const match = game[flippedIndexes[0]].colorId === game[flippedIndexes[1]].colorId
  
    if (match) {
      const newGame = [...game]
      newGame[flippedIndexes[0]].flipped = true
      newGame[flippedIndexes[1]].flipped = true
      setGame(newGame)
  
      const newIndexes = [...flippedIndexes]
      newIndexes.push(false)
      setFlippedIndexes(newIndexes)
    } else {
      const newIndexes = [...flippedIndexes]
      newIndexes.push(true)
      setFlippedIndexes(newIndexes)
    }
  }

  if (game.length === 0) return <div>loading...</div>
  else {
    return (
      <div id="cards">
        {game.map((card, index) => (
          <div className="card" key={index}>
            <Card
              id={index}
              color={card.color}
              game={game}
              flippedCount={flippedCount}
              setFlippedCount={setFlippedCount}
              flippedIndexes={flippedIndexes}
              setFlippedIndexes={setFlippedIndexes}
              userName={userName}
            />
          </div>
        ))}
      </div>
    )
  }
}


function Card({
  id,
  color,
  game,
  flippedCount,
  setFlippedCount,
  flippedIndexes,
  setFlippedIndexes,
  userName,
}) {
  const [flipped, set] = useState(false)
  const {transform, opacity} = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: {mass: 5, tension: 500, friction: 80},
  })

  useEffect(() => {
    if (flippedIndexes[2] === true && flippedIndexes.indexOf(id) > -1) {
      setTimeout(() => {
        set(state => !state)
        setFlippedCount(flippedCount + 1)
        setFlippedIndexes([])
      }, 1000)
    } else if (flippedIndexes[2] === false && id === 0) {
      setFlippedCount(flippedCount + 1)
      setFlippedIndexes([])
    }
  }, [flippedIndexes])

  const onCardClick = () => {
    if (!game[id].flipped && flippedCount % 3 === 0) {
      set(state => !state)
      setFlippedCount(flippedCount + 1)
      const newIndexes = [...flippedIndexes]
      newIndexes.push(id)
      setFlippedIndexes(newIndexes)
    } else if (
      flippedCount % 3 === 1 &&
      !game[id].flipped &&
      flippedIndexes.indexOf(id) < 0
    ) {
      set(state => !state)
      setFlippedCount(flippedCount + 1)
      const newIndexes = [...flippedIndexes]
      newIndexes.push(id)
      setFlippedIndexes(newIndexes)
    }
  }

  return (
    <div onClick={onCardClick}>
        {console.log(userName)}
      <a.div
        className="c back"
        style={{
          opacity: opacity.interpolate(o => 1 - o),
          transform,
        }}
      />
      <a.div
        className="c front"
        style={{
          opacity,
          transform: transform.interpolate(t => `${t} rotateX(180deg)`),
          background: color,
        }}
      />
    </div>
  )
}
