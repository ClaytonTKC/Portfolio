import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Education } from '../../services/content.service';

interface EducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Education) => void;
    initialData?: Education | null;
    isLoading?: boolean;
}

export const EducationModal: React.FC<EducationModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isLoading
}) => {
    const { register, handleSubmit, reset, setValue } = useForm<Education>();

    useEffect(() => {
        if (initialData) {
            setValue('degree', initialData.degree);
            setValue('degreeFr', initialData.degreeFr);
            setValue('school', initialData.school);
            setValue('schoolFr', initialData.schoolFr);
            setValue('location', initialData.location);
            setValue('locationFr', initialData.locationFr);
            // Format dates for input type="date"
            setValue('startDate', initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
            setValue('endDate', initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '');
            setValue('description', initialData.description);
            setValue('descriptionFr', initialData.descriptionFr);
            setValue('sortOrder', initialData.sortOrder);
        } else {
            reset({
                degree: '',
                degreeFr: '',
                school: '',
                schoolFr: '',
                location: '',
                locationFr: '',
                startDate: '',
                endDate: '',
                description: '',
                descriptionFr: '',
                sortOrder: 0
            });
        }
    }, [initialData, reset, setValue]);

    const onSubmit = (data: Education) => {
        onSave({
            ...data,
            sortOrder: Number(data.sortOrder) || 0
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Education' : 'Add Education'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Degree / Certificate (EN)
                        </label>
                        <input
                            {...register('degree', { required: 'Degree is required' })}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Bachelor of Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Degree / Certificate (FR)
                        </label>
                        <input
                            {...register('degreeFr')}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Baccalauréat en Informatique"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            School / Institution (EN)
                        </label>
                        <input
                            {...register('school', { required: 'School is required' })}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. University of Technology"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            School / Institution (FR)
                        </label>
                        <input
                            {...register('schoolFr')}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. Université de Technologie"
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
                            placeholder="e.g. New York, NY"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                            Location (FR)
                        </label>
                        <input
                            {...register('locationFr')}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            placeholder="e.g. New York, NY"
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

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Description (EN)
                    </label>
                    <textarea
                        {...register('description')}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] min-h-[100px]"
                        placeholder="Details about program, achievements, etc."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Description (FR)
                    </label>
                    <textarea
                        {...register('descriptionFr')}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] min-h-[100px]"
                        placeholder="Détails sur le programme, réalisations, etc."
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
                        {isLoading ? 'Saving...' : 'Save Education'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
