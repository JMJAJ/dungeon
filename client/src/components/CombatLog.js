// src/components/CombatLog.js
import React from 'react';

const CombatLog = ({ log }) => (
    <div className="combat-log">
        <h3>Combat Log</h3>
        <p>{log || 'No recent combat.'}</p>
    </div>
);

export default CombatLog;