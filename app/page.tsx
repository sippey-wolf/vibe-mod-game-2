'use client'

import Game from '../game/Game'; // Import the Game component
import styles from '../styles/home.module.css';

export default function HomePage() {
  return (
    <main className={styles.gameContainer}>
      <Game />
    </main>
  );
}
