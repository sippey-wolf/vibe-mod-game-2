import React from 'react';
import styles from '../../styles/home.module.css'; // Assuming global CSS for object styling

const Tile = ({ position, correctPosition, svgClue, gridSize, onClick }) => {
  const tileSize = 150 / gridSize; // Assuming SVG is 150x150, and tiles are square

  const tileStyle = {
    position: 'absolute',
    left: `${position.x * tileSize}px`,
    top: `${position.y * tileSize}px`,
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgClue)}')`,
    backgroundSize: `${gridSize * tileSize}px ${gridSize * tileSize}px`, // Full SVG size
    backgroundPosition: `-${correctPosition.x * tileSize}px -${correctPosition.y * tileSize}px`, // Position to show correct segment
    border: '1px solid #666',
    cursor: 'pointer',
    transition: 'left 0.1s ease-in-out, top 0.1s ease-in-out',
    boxSizing: 'border-box',
  };

  return (
    <div className={styles.tile} style={tileStyle} onClick={onClick}>
      {/* No value needed, content is the SVG segment */}
    </div>
  );
};

export default Tile;