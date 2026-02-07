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
    const { register, handleSubmit, reset, setValue } = useForm<Experience & { descriptionStr: string, descriptionFrStr: string }>();

    useEffect(() => {
        if (initialData) {
            setValue('title', initialData.title);
            setValue('titleFr', initialData.titleFr);
            setValue('company', initialData.company);
            setValue('companyFr', initialData.companyFr);
            setValue('location', initialData.location);
            setValue('locationFr', initialData.locationFr);
            setValue('startDate', initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
            setValue('endDate', initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '');
            setValue('current', initialData.current);
            setValue('descriptionStr', initialData.description.join('\n'));
            setValue('descriptionFrStr', (initialData.descriptionFr || []).join('\n'));
            setValue('sortOrder', initialData.sortOrder);
        } else {
            reset({
                title: '',
                titleFr: '',
                company: '',
                companyFr: '',
                location: '',
                locationFr: '',
                startDate: '',
                endDate: '',
                current: false,
                descriptionStr: '',
                descriptionFrStr: '',
                sortOrder: 0
            });
        }
    }, [initialData, reset, setValue]);

    const onSubmit = (data: Experience & { descriptionStr: string, descriptionFrStr: string }) => {
        // Convert newline separated string back to array
        const descriptionArray = data.descriptionStr
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const descriptionFrArray = data.descriptionFrStr
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        onSave({
            ...data,
            description: descriptionArray,
            descriptionFr: descriptionFrArray,
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
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Job Title (EN)
                        </label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Senior Frontend Developer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Job Title (FR)
                        </label>
                        <input
                            {...register('titleFr')}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Développeur Frontend Senior"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Company (EN)
                        </label>
                        <input
                            {...register('company', { required: 'Company is required' })}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Tech Corp Inc."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Company (FR)
                        </label>
                        <input
                            {...register('companyFr')}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Tech Corp Inc."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Location (EN)
                        </label>
                        <input
                            {...register('location')}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Remote"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Location (FR)
                        </label>
                        <input
                            {...register('locationFr')}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Télétravail"
                        />
                    </div>
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
                        Description (EN) (one bullet point per line)
                    </label>
                    <textarea
                        {...register('descriptionStr')}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] min-h-[150px]"
                        placeholder="- Led a team of 5 developers&#10;- Improved performance by 50%"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Description (FR) (one bullet point per line)
                    </label>
                    <textarea
                        {...register('descriptionFrStr')}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] min-h-[150px]"
                        placeholder="- Dirigé une équipe de 5 développeurs&#10;- Amélioré les performances de 50%"
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
