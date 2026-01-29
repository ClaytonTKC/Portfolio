import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Hobby } from '../../services/content.service';

interface HobbyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Hobby) => void;
    initialData?: Hobby | null;
    isLoading?: boolean;
}

export const HobbyModal: React.FC<HobbyModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isLoading
}) => {
    const { register, handleSubmit, reset, setValue } = useForm<Hobby>();

    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('icon', initialData.icon);
            setValue('description', initialData.description);
            setValue('sortOrder', initialData.sortOrder);
        } else {
            reset({
                name: '',
                icon: '',
                description: '',
                sortOrder: 0
            });
        }
    }, [initialData, reset, setValue]);

    const onSubmit = (data: Hobby) => {
        onSave({
            ...data,
            sortOrder: Number(data.sortOrder) || 0
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Hobby' : 'Add Hobby'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Name
                    </label>
                    <input
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="e.g. Photography"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Icon (Emoji)
                    </label>
                    <input
                        {...register('icon', { required: 'Icon is required' })}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="e.g. 📷"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Description
                    </label>
                    <textarea
                        {...register('description')}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] min-h-[100px]"
                        placeholder="Brief description of the hobby..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Sort Order
                    </label>
                    <input
                        type="number"
                        {...register('sortOrder')}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Hobby'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
