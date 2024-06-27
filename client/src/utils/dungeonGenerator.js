export const CELL_TYPES = {
    WALL: 'wall',
    PATH: 'path',
    PORTAL: 'portal',
    START: 'start',
    ITEM: 'item',
};

export const ITEM_TYPES = {
    COIN: 'coin',
    POTION: 'potion',
    MANA_POTION: 'mana_potion',
    KEY: 'key',
};

const isValidCell = (dungeon, x, y) => {
    return x >= 0 && y >= 0 && y < dungeon.length && x < dungeon[0].length;
};

const findPath = (dungeon, startX, startY, endX, endY) => {
    const queue = [[startX, startY]];
    const visited = new Set();
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    while (queue.length > 0) {
        const [x, y] = queue.shift();
        
        if (x === endX && y === endY) {
            return true;
        }

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            const key = `${newX},${newY}`;

            if (isValidCell(dungeon, newX, newY) && 
                !visited.has(key) && 
                dungeon[newY][newX] !== CELL_TYPES.WALL) {
                queue.push([newX, newY]);
                visited.add(key);
            }
        }
    }

    return false;
};

export const generateDungeon = ({ width, height }) => {
    let dungeon, startX, startY, portalX, portalY;
    let validDungeon = false;

    while (!validDungeon) {
        dungeon = Array(height).fill().map(() =>
            Array(width).fill().map(() =>
                Math.random() > 0.3 ? CELL_TYPES.PATH : CELL_TYPES.WALL
            )
        );

        startX = 0;
        startY = 0;
        dungeon[startY][startX] = CELL_TYPES.START;

        do {
            portalX = Math.floor(Math.random() * width);
            portalY = Math.floor(Math.random() * height);
        } while (dungeon[portalY][portalX] === CELL_TYPES.WALL || (portalX === startX && portalY === startY));

        dungeon[portalY][portalX] = CELL_TYPES.PORTAL;

        validDungeon = findPath(dungeon, startX, startY, portalX, portalY);

        if (validDungeon) {
            const itemCount = Math.floor((width * height) * 0.1);
            for (let i = 0; i < itemCount; i++) {
                let itemX, itemY;
                do {
                    itemX = Math.floor(Math.random() * width);
                    itemY = Math.floor(Math.random() * height);
                } while (dungeon[itemY][itemX] !== CELL_TYPES.PATH);

                const itemType = Object.values(ITEM_TYPES)[Math.floor(Math.random() * Object.values(ITEM_TYPES).length)];
                dungeon[itemY][itemX] = { type: CELL_TYPES.ITEM, item: itemType };
            }
        }
    }

    return dungeon;
};