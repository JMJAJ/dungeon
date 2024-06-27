import React from 'react';

const PlayerStats = ({ stats }) => (
    <div className="player-stats">
        <h3>Player Stats</h3>
        <p>HP: {stats.hp}/{stats.maxHp}</p>
        <p>MP: {stats.mp}/{stats.maxMp}</p>
        <p>Gold: {stats.gold}</p>
    </div>
);

export default PlayerStats;