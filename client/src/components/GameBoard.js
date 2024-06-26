// src/components/GameBoard.js
import React from 'react';
import Cell from './Cell';
import { CELL_TYPES } from '../utils/dungeonGenerator';

const GameBoard = ({ dungeon, playerPosition }) => {
  const style = {
    '--dungeon-width': dungeon[0].length,
    '--dungeon-height': dungeon.length,
  };

  return (
    <div className="game-container" style={style}>
      {dungeon.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            type={cell}
            isPlayerHere={x === playerPosition.x && y === playerPosition.y}
          />
        ))
      )}
    </div>
  );
};

export default React.memo(GameBoard);