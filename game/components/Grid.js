import React from 'react';
import styles from '../../styles/home.module.css'; // Assuming a global CSS for grid styling

const Grid = ({ gridSize, children }) => {
  const tileSize = 150 / gridSize; // Assuming SVG is 150x150

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
    gridTemplateRows: `repeat(${gridSize}, ${tileSize}px)`,
    border: '1px solid #333',
    backgroundColor: '#222',
    position: 'relative',
    width: `${gridSize * tileSize}px`,
    height: `${gridSize * tileSize}px`,
  };

  return (
    <div className={styles.gridContainer} style={gridStyle}>
      {children}
    </div>
  );
};

export default Grid;