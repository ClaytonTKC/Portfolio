import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const showHeader = title || showCloseButton;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-[var(--color-surface)] w-full max-w-lg rounded-xl shadow-2xl border border-[var(--glass-border)] animate-scale-in max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {showHeader && (
                    <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
                        <h2 className="text-xl font-bold">{title}</h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[var(--color-background)] rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
            {/* Click outside to close */}
            <div className="absolute inset-0 z-[-1]" onClick={onClose} />
        </div>
    );
};
