import React, { useState, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { capitals } from './capitals';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

const App = () => {
  const [remainingCapitals, setRemainingCapitals] = useState([...capitals]);
  const [currentCapital, setCurrentCapital] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [guessedCapitals, setGuessedCapitals] = useState([]);
  const [error, setError] = useState(null);

  // Initialize the game
  const selectNewCapital = useCallback(() => {
    if (remainingCapitals.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingCapitals.length);
      setCurrentCapital(remainingCapitals[randomIndex]);
      setUserInput('');
      setError(null);
    }
  }, [remainingCapitals]);

  // Start the game when component mounts
  React.useEffect(() => {
    if (!currentCapital) {
      selectNewCapital();
    }
  }, [currentCapital, selectNewCapital]);

  const handleGuess = () => {
    if (!currentCapital) return;

    if (userInput.toLowerCase() === currentCapital.city.toLowerCase()) {
      // Correct guess
      setGuessedCapitals([...guessedCapitals, currentCapital]);
      setRemainingCapitals(remainingCapitals.filter(cap => cap.city !== currentCapital.city));
      setError(null);
      selectNewCapital();
    } else {
      // Wrong guess
      setError(`Incorrect! Try another capital.`);
      selectNewCapital();
    }
    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div className="game-container">
      <h1>Capital Cities Guessing Game</h1>
      {currentCapital && (
        <div>
          <h2>What is the capital of {currentCapital.country}?</h2>
          <p>Remaining capitals: {remainingCapitals.length}</p>
          <p>Correctly guessed: {capitals.length - remainingCapitals.length}</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
      
      <div className="map-container">
        <ComposableMap projection="geoMercator" style={{ width: "100%", height: "auto" }}>
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#F5F4F6' },
                      pressed: { outline: 'none' }
                    }}
                  />
                ))
              }
            </Geographies>
            
            {capitals.map((capital) => (
              <Marker key={capital.city} coordinates={capital.coordinates}>
                <circle
                  r={4}
                  fill={
                    guessedCapitals.includes(capital)
                      ? "#00FF00"  // Green for correctly guessed
                      : "#444444"  // Dark grey for unguessed
                  }
                  stroke="#FFF"
                  strokeWidth={1}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter capital city name"
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            marginRight: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button 
          onClick={handleGuess}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit Guess
        </button>
      </div>

      {remainingCapitals.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Congratulations! You've guessed all the capitals!</h2>
          <button
            onClick={() => {
              setRemainingCapitals([...capitals]);
              setGuessedCapitals([]);
              selectNewCapital();
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
