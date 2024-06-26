// src/hooks/useKeyPress.js
import { useEffect } from 'react';

const useKeyPress = (keyHandlers) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const handler = keyHandlers[event.key];
            if (handler) {
                event.preventDefault();
                handler();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [keyHandlers]);
};

export default useKeyPress;