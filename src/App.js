import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { capitals } from './capitals';

// URL zu einer vollständigen Weltkarten-TopoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const App = () => {
  const [remainingCapitals, setRemainingCapitals] = useState([...capitals]);
  const [currentCapital, setCurrentCapital] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [guessedCapitals, setGuessedCapitals] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  // Initialize the game
  const selectNewCapital = useCallback(() => {
    if (remainingCapitals.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingCapitals.length);
      const selected = remainingCapitals[randomIndex];
      console.log('Selected new capital:', selected.city);
      setCurrentCapital(selected);
      setError(null);
      setSuccess(false);
    }
  }, [remainingCapitals]);

  // Start the game when component mounts
  useEffect(() => {
    if (!currentCapital) {
      selectNewCapital();
    }
  }, [currentCapital, selectNewCapital]);

  // Focus input field when capital changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentCapital]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setError(null);
    setSuccess(false);
  };

  const handleGuess = () => {
    if (!currentCapital || !userInput.trim()) {
      setError("Please enter a city name");
      return;
    }

    console.log('Submitting guess:', userInput);
    console.log('Current capital:', currentCapital.city);
    
    const normalizedInput = userInput.toLowerCase().trim();
    const normalizedAnswer = currentCapital.city.toLowerCase().trim();

    if (normalizedInput === normalizedAnswer) {
      console.log('Correct guess!');
      setSuccess(true);
      setError(null);
      
      // Update guessed capitals
      const newGuessedCapitals = [...guessedCapitals, currentCapital];
      setGuessedCapitals(newGuessedCapitals);
      
      // Update remaining capitals
      const newRemainingCapitals = remainingCapitals.filter(cap => cap.city !== currentCapital.city);
      setRemainingCapitals(newRemainingCapitals);
      
      // Clear input and select new capital after a short delay
      setTimeout(() => {
        setUserInput('');
        selectNewCapital();
      }, 1000);
    } else {
      console.log('Incorrect guess!');
      setError(`Incorrect! The capital of ${currentCapital.country} is ${currentCapital.city}`);
      setSuccess(false);
      
      // Clear input and select new capital after showing the error
      setTimeout(() => {
        setUserInput('');
        selectNewCapital();
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1000px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', margin: '20px 0' }}>Capital Cities Guessing Game</h1>
      
      {currentCapital && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <h2 style={{ color: '#444', marginBottom: '10px' }}>What is the capital of {currentCapital.country}?</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <p style={{ margin: '0' }}>Remaining capitals: {remainingCapitals.length}</p>
            <p style={{ margin: '0' }}>Correctly guessed: {capitals.length - remainingCapitals.length}</p>
          </div>
        </div>
      )}

      {(error || success) && (
        <div style={{ 
          color: success ? '#2e7d32' : '#d32f2f',
          backgroundColor: success ? '#e8f5e9' : '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          margin: '10px auto',
          maxWidth: '600px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {error || 'Correct!'}
        </div>
      )}

      <div style={{ 
        backgroundColor: '#F5F5F5', 
        borderRadius: '10px', 
        padding: '20px',
        margin: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flex: '1'
      }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 100,
            center: [0, 20]
          }}
          style={{
            width: "100%",
            height: "400px"
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                  style={{
                    default: {
                      fill: "#EAEAEC",
                      outline: "none"
                    },
                    hover: {
                      fill: "#F5F5F5",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E4E4E4",
                      outline: "none"
                    }
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
                    ? "#00FF00"  // Grün für geratene Hauptstädte
                    : "#444444"  // Dunkelgrau für noch nicht geratene
                }
                stroke="#FFF"
                strokeWidth={2}
              />
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div style={{ 
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '20px 0'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter capital city name"
            style={{
              padding: '15px 20px',
              fontSize: '18px',
              borderRadius: '4px',
              border: '2px solid #ccc',
              width: '60%',
              outline: 'none',
              transition: 'all 0.3s',
              borderColor: error ? '#d32f2f' : success ? '#2e7d32' : '#ccc'
            }}
          />
          <button 
            onClick={handleGuess}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '30%',
              fontWeight: 'bold'
            }}
          >
            Submit Guess
          </button>
        </div>
      </div>

      {remainingCapitals.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          margin: '20px 0',
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#2e7d32' }}>Congratulations! You've guessed all the capitals!</h2>
          <button
            onClick={() => {
              console.log('Restarting game');
              setRemainingCapitals([...capitals]);
              setGuessedCapitals([]);
              setUserInput('');
              selectNewCapital();
            }}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              fontWeight: 'bold'
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