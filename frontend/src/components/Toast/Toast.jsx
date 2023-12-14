import { useState, useEffect } from 'react';
import './toast.css';

export default function Toast({ error, message, onTimeoutEnd }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            onTimeoutEnd(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return isVisible ? (
        <div
            className={`toast ${error ? 'toast-error' : 'toast-success'}`}
            style={{ display: isVisible ? 'block' : 'none' }}
        >
            {message}
        </div>
    ) : null;
}
