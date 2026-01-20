import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
    return (
        <div
            className={`glass-card p-6 ${hover ? 'transition-transform duration-300 hover:-translate-y-1' : ''} ${className}`}
        >
            {children}
        </div>
    );
};
