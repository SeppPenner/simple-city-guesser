# Capital Cities Guessing Game

A fun and interactive web application built with React that helps users learn world capital cities. The game displays an interactive world map where players need to guess capital cities of different countries.

## Features

- Interactive world map visualization using react-simple-maps
- Random selection of capital cities
- Real-time feedback on correct/incorrect answers
- Visual tracking of progress with colored markers
- Score tracking system
- Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 11.12.0 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Navigate to the project directory:
```bash
cd simple-city-guesser
```

3. Install dependencies:
```bash
npm install
```

## Running the Application

To start the development server:
```bash
npm start
```

The application will be available at `http://localhost:1234`.

## How to Play

1. The game will display a country name and ask for its capital city
2. Type your answer in the input field
3. Press Enter or click the Submit button to check your answer
4. Correct answers will be marked in green on the map
5. Keep playing until you've guessed all capital cities
6. You can restart the game at any time by clicking the "Play Again" button

## Technologies Used

- React.js
- react-simple-maps
- Parcel Bundler
- D3-geo

## Project Structure

```
simple-city-guesser/
├── src/
│   ├── App.js         # Main application component
│   ├── index.js       # Application entry point
│   ├── index.html     # HTML template
│   └── capitals.js    # Capital cities data
├── package.json
├── .babelrc
└── .gitignore
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
