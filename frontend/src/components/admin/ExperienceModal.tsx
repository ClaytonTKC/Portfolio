import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Experience } from '../../services/content.service';

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Experience) => void;
    initialData?: Experience | null;
    isLoading?: boolean;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isLoading
}) => {
    const { register, handleSubmit, reset, setValue } = useForm<Experience & { descriptionStr: string }>();

    useEffect(() => {
        if (initialData) {
            setValue('title', initialData.title);
            setValue('company', initialData.company);
            setValue('location', initialData.location);
            setValue('startDate', initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
            setValue('endDate', initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '');
            setValue('current', initialData.current);
            setValue('descriptionStr', initialData.description.join('\n'));
            setValue('sortOrder', initialData.sortOrder);
        } else {
            reset({
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                descriptionStr: '',
                sortOrder: 0
            });
        }
    }, [initialData, reset, setValue]);

    const onSubmit = (data: Experience & { descriptionStr: string }) => {
        // Convert newline separated string back to array
        const descriptionArray = data.descriptionStr
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        onSave({
            ...data,
            description: descriptionArray,
            sortOrder: Number(data.sortOrder) || 0
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Experience' : 'Add Experience'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Job Title
                    </label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="e.g. Senior Frontend Developer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Company
                    </label>
                    <input
                        {...register('company', { required: 'Company is required' })}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="e.g. Tech Corp Inc."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Location
                    </label>
                    <input
                        {...register('location')}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="e.g. Remote"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            {...register('startDate', { required: 'Start date is required' })}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            {...register('endDate')}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        {...register('current')}
                        id="current"
                        className="rounded bg-[var(--color-surface)] border-[var(--glass-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <label htmlFor="current" className="text-sm font-medium text-[var(--color-text)]">
                        I currently work here
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Description (one bullet point per line)
                    </label>
                    <textarea
                        {...register('descriptionStr')}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] min-h-[150px]"
                        placeholder="- Led a team of 5 developers&#10;- Improved performance by 50%"
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
                        {isLoading ? 'Saving...' : 'Save Experience'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
