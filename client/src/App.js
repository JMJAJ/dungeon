import React, { useState, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Inventory from './components/Inventory';
import PlayerStats from './components/PlayerStats';
import useKeyPress from './hooks/useKeyPress';
import { generateDungeon, CELL_TYPES, ITEM_TYPES } from './utils/dungeonGenerator';
import './App.css';

const INITIAL_DUNGEON_SIZE = { width: 10, height: 10 };
const NEXT_DUNGEON_SIZE = { width: 20, height: 20 };

const INITIAL_PLAYER_STATS = {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    gold: 0,
};

const App = () => {
    const [gameState, setGameState] = useState(() => ({
        dungeon: generateDungeon(INITIAL_DUNGEON_SIZE),
        playerPosition: { x: 0, y: 0 },
        dungeonLevel: 1,
        inventory: Object.values(ITEM_TYPES).reduce((acc, item) => ({ ...acc, [item]: 0 }), {}),
        playerStats: { ...INITIAL_PLAYER_STATS },
    }));

    const movePlayer = useCallback((direction) => {
        setGameState(prevState => {
            const { dungeon, playerPosition, inventory, playerStats } = prevState;
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
            let newPlayerStats = { ...playerStats };

            if (dungeon[newY][newX].type === CELL_TYPES.ITEM) {
                const itemType = dungeon[newY][newX].item;
                newInventory[itemType]++;
                newDungeon[newY][newX] = CELL_TYPES.PATH;
                
                if (itemType === ITEM_TYPES.COIN) {
                    newPlayerStats.gold += 1;
                }
            }

            if (dungeon[newY][newX] === CELL_TYPES.PORTAL) {
                const newDungeon = generateDungeon(NEXT_DUNGEON_SIZE);
                return {
                    dungeon: newDungeon,
                    playerPosition: { x: 0, y: 0 },
                    dungeonLevel: prevState.dungeonLevel + 1,
                    inventory: newInventory,
                    playerStats: newPlayerStats,
                };
            }

            return {
                ...prevState,
                dungeon: newDungeon,
                playerPosition: { x: newX, y: newY },
                inventory: newInventory,
                playerStats: newPlayerStats,
            };
        });
    }, []);

    const useItem = useCallback((itemType) => {
        setGameState(prevState => {
            const { inventory, playerStats } = prevState;
            if (inventory[itemType] > 0) {
                const newInventory = { ...inventory, [itemType]: inventory[itemType] - 1 };
                let newPlayerStats = { ...playerStats };

                switch (itemType) {
                    case ITEM_TYPES.POTION:
                        newPlayerStats.hp = Math.min(newPlayerStats.hp + 20, newPlayerStats.maxHp);
                        break;
                    case ITEM_TYPES.MANA_POTION:
                        newPlayerStats.mp = Math.min(newPlayerStats.mp + 15, newPlayerStats.maxMp);
                        break;
                    // Add more item effects here
                }

                return { ...prevState, inventory: newInventory, playerStats: newPlayerStats };
            }
            return prevState;
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
            <h1>Endless Dungeon RPG</h1>
            <div className="game-layout">
                <GameBoard
                    dungeon={gameState.dungeon}
                    playerPosition={gameState.playerPosition}
                />
                <div className="sidebar">
                    <PlayerStats stats={gameState.playerStats} />
                    <Inventory items={gameState.inventory} onUseItem={useItem} />
                </div>
            </div>
            <div className="controls-info">
                <p>Use arrow keys or WASD to move</p>
            </div>
        </div>
    );
};

export default App;