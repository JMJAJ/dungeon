import React from 'react';

const Inventory = ({ items, onUseItem }) => (
    <div className="inventory">
        <h3>Inventory</h3>
        <ul>
            {Object.entries(items).map(([itemType, count]) => (
                <li key={itemType}>
                    {itemType}: {count}
                    {count > 0 && itemType !== 'coin' && (
                        <button onClick={() => onUseItem(itemType)}>Use</button>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

export default Inventory;