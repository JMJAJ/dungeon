import React, { useState, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Inventory from './components/Inventory';
import useKeyPress from './hooks/useKeyPress';
import { generateDungeon, CELL_TYPES, ITEM_TYPES } from './utils/dungeonGenerator';
import './App.css';

const INITIAL_DUNGEON_SIZE = { width: 10, height: 10 };
const NEXT_DUNGEON_SIZE = { width: 20, height: 20 };

const App = () => {
    const [gameState, setGameState] = useState(() => ({
        dungeon: generateDungeon(INITIAL_DUNGEON_SIZE),
        playerPosition: { x: 0, y: 0 },
        dungeonLevel: 1,
        inventory: Object.values(ITEM_TYPES).reduce((acc, item) => ({ ...acc, [item]: 0 }), {}),
    }));

    const movePlayer = useCallback((direction) => {
        setGameState(prevState => {
            const { dungeon, playerPosition, inventory } = prevState;
            const { x, y } = playerPosition;
            let newX = x, newY = y;

            switch (direction) {
                case 'up': newY = Math.max(0, y - 1); break;
                case 'down': newY = Math.min(dungeon.length - 1, y + 1); break;
                case 'left': newX = Math.max(0, x - 1); break;
                case 'right': newX = Math.min(dungeon[0].length - 1, x + 1); break;
                default: return prevState;
            }

            if (dungeon[newY][newX] === CELL_TYPES.WALL) {
                return prevState;
            }

            let newInventory = { ...inventory };
            let newDungeon = [ ...dungeon.map(row => [...row]) ];

            if (dungeon[newY][newX].type === CELL_TYPES.ITEM) {
                const itemType = dungeon[newY][newX].item;
                newInventory[itemType]++;
                newDungeon[newY][newX] = CELL_TYPES.PATH;
            }

            if (dungeon[newY][newX] === CELL_TYPES.PORTAL) {
                const newDungeon = generateDungeon(NEXT_DUNGEON_SIZE);
                return {
                    dungeon: newDungeon,
                    playerPosition: { x: 0, y: 0 },
                    dungeonLevel: prevState.dungeonLevel + 1,
                    inventory: newInventory,
                };
            }

            return {
                ...prevState,
                dungeon: newDungeon,
                playerPosition: { x: newX, y: newY },
                inventory: newInventory,
            };
        });
    }, []);

    useKeyPress({
        'ArrowUp': () => movePlayer('up'),
        'ArrowDown': () => movePlayer('down'),
        'ArrowLeft': () => movePlayer('left'),
        'ArrowRight': () => movePlayer('right'),
        'w': () => movePlayer('up'),
        's': () => movePlayer('down'),
        'a': () => movePlayer('left'),
        'd': () => movePlayer('right'),
    });

    return (
        <div className="App">
            <h1>Dungeon</h1>
            <div className="game-info">
                <p>Level: {gameState.dungeonLevel}</p>
                <p>Position: ({gameState.playerPosition.x}, {gameState.playerPosition.y})</p>
            </div>
            <div className="game-layout">
                <GameBoard
                    dungeon={gameState.dungeon}
                    playerPosition={gameState.playerPosition}
                />
                <Inventory items={gameState.inventory} />
            </div>
            <div className="controls-info">
                <p>Use arrow keys or WASD to move</p>
            </div>
        </div>
    );
};

export default App;