import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title: string;
    message: string;
}

export const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, type, title, message }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col items-center text-center p-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                    }`}>
                    {type === 'success' ? '✓' : '✕'}
                </div>

                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-[var(--color-text-muted)] mb-6">{message}</p>

                <Button
                    variant={type === 'success' ? 'primary' : 'secondary'}
                    onClick={onClose}
                    className="w-full"
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
};
