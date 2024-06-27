import React from 'react';
import { CELL_TYPES } from '../utils/dungeonGenerator';

const Cell = ({ type, isPlayerHere, item }) => {
    let cellClass = `cell ${type}`;
    if (isPlayerHere) cellClass += ' player';
    
    let content = null;
    if (type === CELL_TYPES.ITEM) {
        content = <span className={`item ${item}`}></span>;
    }

    return (
        <div className={cellClass}>
            {content}
        </div>
    );
};

export default React.memo(Cell);