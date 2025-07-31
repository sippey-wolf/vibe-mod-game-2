import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Tile from './components/Tile'; // Import Tile component
import styles from '../styles/home.module.css';

// Helper to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Function to generate a solvable puzzle
const generateSolvablePuzzle = (gridSize) => {
  const totalTiles = gridSize * gridSize;
  let tiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1); // Tiles 1 to N-1
  tiles.push(0); // 0 represents the empty slot

  let inversions;
  let solvable;

  do {
    tiles = shuffleArray([...tiles]);
    inversions = 0;
    for (let i = 0; i < totalTiles - 1; i++) {
      for (let j = i + 1; j < totalTiles; j++) {
        if (tiles[i] !== 0 && tiles[j] !== 0 && tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }

    const emptyRowFromBottom = gridSize - Math.floor(tiles.indexOf(0) / gridSize);

    if (gridSize % 2 === 1) { // Odd grid size
      solvable = (inversions % 2 === 0);
    } else { // Even grid size
      solvable = (emptyRowFromBottom % 2 === 1 && inversions % 2 === 0) ||
                 (emptyRowFromBottom % 2 === 0 && inversions % 2 === 1);
    }
  } while (!solvable);

  // Convert 1D array to 2D positions
  const puzzleTiles = tiles.filter(val => val !== 0).map((val, index) => {
    const current1DIndex = tiles.indexOf(val);
    return {
      id: `tile-${val}`,
      value: val,
      position: {
        x: current1DIndex % gridSize,
        y: Math.floor(current1DIndex / gridSize),
      },
      correctPosition: {
        x: (val - 1) % gridSize,
        y: Math.floor((val - 1) / gridSize),
      },
    };
  });

  const emptySlotIndex = tiles.indexOf(0);
  const emptySlotPos = {
    x: emptySlotIndex % gridSize,
    y: Math.floor(emptySlotIndex / gridSize),
  };

  return { puzzleTiles, emptySlotPos };
};


const levels = [
  {
    id: 1,
    gridSize: 3,
    narrative: {
      pre: "The detective's office, late at night. Rain streaks down the window. A new box of 'unexamined evidence' arrives. Inside, a torn photograph, now fragmented into pieces. 'Odd. This wasn't in the original report. Looks like it was deliberately ripped.'",
      post: "The reassembled photograph clearly shows Eleanor Ash with a mysterious man. The detective studies the photo. 'Who is this man? He was never mentioned. A new lead. Or a deliberate omission.' The photo is placed on a corkboard, marked 'CLUE 1.'",
    },
    svgClue: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="150" height="150" fill="#ADD8E6"/> <!-- Light Blue Background -->
      <!-- Head -->
      <circle cx="75" cy="75" r="60" fill="#FFD700"/> <!-- Gold Head -->
      <!-- Eyes -->
      <circle cx="55" cy="60" r="8" fill="#4682B4"/> <!-- Steel Blue Eyes -->
      <circle cx="95" cy="60" r="8" fill="#4682B4"/>
      <!-- Mouth -->
      <path d="M60 95 Q75 110 90 95" stroke="#8B0000" stroke-width="5" fill="none"/> <!-- Dark Red Mouth -->
      <!-- Nose -->
      <circle cx="75" cy="80" r="4" fill="#8B0000"/>
    </svg>`,
  },
  {
    id: 2,
    gridSize: 3,
    narrative: {
      pre: "Dusty evidence locker at the police station. Fluorescent lights hum. The detective gains access to Eleanor Ash's original evidence box. 'Most of it's standard. But this... a sealed envelope, marked 'personal effects.' Inside, a handful of shredded paper.'",
      post: "The reconstructed letter, with key phrases highlighted: 'I'm afraid of D,' 'He knows too much,' 'I'm going to the police.' The detective reads the letter. 'D? Who is D? And what did he know? This changes everything. The original report mentioned no such person.' The letter is added to the corkboard, marked 'CLUE 2.'",
    },
    svgClue: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="150" height="150" fill="#444"/>
      <line x1="20" y1="40" x2="130" y2="40" stroke="#888" stroke-width="5"/>
      <line x1="20" y1="60" x2="100" y2="60" stroke="#888" stroke-width="5"/>
      <line x1="20" y1="80" x2="110" y2="80" stroke="#888" stroke-width="5"/>
      <text x="75" y="110" font-family="Arial" font-size="30" fill="#00ff00" text-anchor="middle">D?</text>
    </svg>`,
  },
  {
    id: 3,
    gridSize: 3,
    narrative: {
      pre: "Eleanor Ash's apartment, now a sterile, empty space. Dust motes dance in the sunlight. The detective returns to the scene of the crime, armed with the new evidence. 'The photo, the letter... they don't fit the official story. Time to see what the room itself has to say.' The detective begins to place markers and furniture based on initial reports, then pauses. 'Something's wrong here. This isn't right.'",
      post: "The reconstructed crime scene clearly shows discrepancies with the suicide report. The detective surveys the scene. 'It was staged. She was murdered. The original report was a lie, or worse, a cover-up.' The three clues (photo, letter, crime scene layout) are presented together, forming a complete picture of the conspiracy. 'The Cold Case of Eleanor Ash... reopened, and now, solved.'",
    },
    svgClue: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="150" height="150" fill="#555"/>
      <rect x="20" y="20" width="30" height="30" fill="#777"/>
      <rect x="100" y="20" width="30" height="30" fill="#777"/>
      <rect x="20" y="100" width="30" height="30" fill="#777"/>
      <rect x="100" y="100" width="30" height="30" fill="#777"/>
      <circle cx="75" cy="75" r="15" fill="#ff0000"/>
      <line x1="60" y1="60" x2="90" y2="90" stroke="#ff0000" stroke-width="5"/>
      <line x1="90" y1="60" x2="60" y2="90" stroke="#ff0000" stroke-width="5"/>
    </svg>`,
  },
];

const Game = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [level, setLevel] = useState(levels[currentLevelIndex]);
  const [tiles, setTiles] = useState([]);
  const [emptySlot, setEmptySlot] = useState({ x: 0, y: 0 });
  const [showNarrative, setShowNarrative] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [narrativeText, setNarrativeText] = useState(level.narrative.pre);

  const initializePuzzle = useCallback(() => {
    const { puzzleTiles, emptySlotPos } = generateSolvablePuzzle(level.gridSize);
    setTiles(puzzleTiles);
    setEmptySlot(emptySlotPos);
  }, [level.gridSize]);

  useEffect(() => {
    initializePuzzle();
  }, [level.gridSize, initializePuzzle]); // Re-initialize when level changes

  const isSolved = useCallback(() => {
    return tiles.every(tile =>
      tile.position.x === tile.correctPosition.x &&
      tile.position.y === tile.correctPosition.y
    );
  }, [tiles]);

  useEffect(() => {
    if (!showNarrative && !showInstructions && isSolved()) {
      setNarrativeText(level.narrative.post);
      setShowNarrative(true);
    }
  }, [showNarrative, showInstructions, isSolved, level.narrative.post]);

  const handleTileClick = useCallback((clickedTile) => {
    if (showNarrative || showInstructions) return;

    const { x: tileX, y: tileY } = clickedTile.position;
    const { x: emptyX, y: emptyY } = emptySlot;

    // Check if clicked tile is adjacent to the empty slot
    const isAdjacent = (Math.abs(tileX - emptyX) === 1 && tileY === emptyY) ||
                       (Math.abs(tileY - emptyY) === 1 && tileX === emptyX);

    if (isAdjacent) {
      // Move the clicked tile to the empty slot's position
      const newTiles = tiles.map(tile =>
        tile.id === clickedTile.id ? { ...tile, position: { x: emptyX, y: emptyY } } : tile
      );
      setTiles(newTiles);

      // Update the empty slot's position to the clicked tile's old position
      setEmptySlot({ x: tileX, y: tileY });
    }
  }, [tiles, emptySlot, showNarrative, showInstructions]);

  const handleNarrativeClick = () => {
    if (showNarrative) {
      if (!isSolved()) {
        setShowNarrative(false);
        setShowInstructions(true);
      } else if (isSolved() && currentLevelIndex < levels.length - 1) {
        setCurrentLevelIndex(prevIndex => prevIndex + 1);
        setLevel(levels[currentLevelIndex + 1]);
        setNarrativeText(levels[currentLevelIndex + 1].narrative.pre);
        setShowNarrative(true);
      } else if (isSolved() && currentLevelIndex === levels.length - 1) {
        setNarrativeText("The Cold Case of Eleanor Ash... reopened, and now, solved.");
      }
    } else if (showInstructions) {
      setShowInstructions(false);
    }
  };

  return (
    <div className={styles.gameContainer}>
      {showNarrative ? (
        <div className={styles.narrativeOverlay} onClick={handleNarrativeClick}>
          <p>{narrativeText}</p>
          {!isSolved() && <p className={styles.clickToContinue}>Click to continue...</p>}
          {isSolved() && currentLevelIndex < levels.length - 1 && <p className={styles.clickToContinue}>Click to proceed to next level...</p>}
          {isSolved() && currentLevelIndex === levels.length - 1 && <p className={styles.clickToContinue}>Click to finish game...</p>}
        </div>
      ) : showInstructions ? (
        <div className={styles.narrativeOverlay} onClick={handleNarrativeClick}>
          <h2>How to Play</h2>
          <p>Click on a tile adjacent to the empty space to move it into the empty space.</p>
          <p>Arrange the tiles to form the correct order (1, 2, 3... from left to right, top to bottom).</p>
          <p className={styles.clickToContinue}>Click to start puzzle...</p>
        </div>
      ) : (
        <Grid gridSize={level.gridSize}>
          {tiles.map(tile => (
            <Tile
              key={tile.id}
              position={tile.position}
              correctPosition={tile.correctPosition}
              svgClue={level.svgClue}
              gridSize={level.gridSize}
              onClick={() => handleTileClick(tile)}
            />
          ))}
          {/* Render the empty slot visually */}
          <div
            className={styles.emptySlot}
            style={{
              position: 'absolute',
              left: `${emptySlot.x * (150 / level.gridSize)}px`,
              top: `${emptySlot.y * (150 / level.gridSize)}px`,
              width: `${150 / level.gridSize}px`,
              height: `${150 / level.gridSize}px`,
              backgroundColor: '#1a1a1a', // Match background
              border: '1px dashed #555',
            }}
          />
        </Grid>
      )}
    </div>
  );
};

export default Game;