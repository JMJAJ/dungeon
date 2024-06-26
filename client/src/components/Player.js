// src/components/Player.js
import React from 'react';
import './Player.css';

const Player = ({ x, y }) => {
    return (
        <div
            className="player"
            style={{ top: `${y * 50}px`, left: `${x * 50}px` }}
        >
            🧙‍♂️
        </div>
    );
};

export default Player;
