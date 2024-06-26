// src/components/Inventory.js
import React from 'react';

const Inventory = ({ items }) => (
    <div className="inventory">
        <h3>Inventory</h3>
        <ul>
            {Object.entries(items).map(([itemType, count]) => (
                <li key={itemType}>{itemType}: {count}</li>
            ))}
        </ul>
    </div>
);

export default Inventory;