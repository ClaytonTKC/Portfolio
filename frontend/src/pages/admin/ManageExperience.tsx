import React, { useEffect, useState } from 'react';
import { contentService, type Experience } from '../../services/content.service';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { StatusModal } from '../../components/ui/StatusModal';
import { ExperienceModal } from '../../components/admin/ExperienceModal';

export const ManageExperience: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Status Modal State
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [statusType, setStatusType] = useState<'success' | 'error'>('success');
    const [statusMessage, setStatusMessage] = useState('');

    const fetchExperiences = React.useCallback(async () => {
        try {
            const data = await contentService.getExperiences();
            setExperiences(data);
        } catch (error) {
            console.error('Failed to fetch experiences:', error);
            showStatus('error', 'Failed to fetch experiences');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExperiences();
    }, [fetchExperiences]);

    const showStatus = (type: 'success' | 'error', message: string) => {
        setStatusType(type);
        setStatusMessage(message);
        setStatusModalOpen(true);
    };

    const handleSave = async (exp: Experience) => {
        setIsLoading(true);
        try {
            if (editingExperience?.id) {
                await contentService.updateExperience(editingExperience.id, exp);
                showStatus('success', 'Experience updated successfully');
            } else {
                await contentService.createExperience(exp);
                showStatus('success', 'Experience created successfully');
            }
            setIsModalOpen(false);
            setEditingExperience(null);
            fetchExperiences();
        } catch (error) {
            console.error('Failed to save experience:', error);
            showStatus('error', 'Failed to save experience');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await contentService.deleteExperience(deleteId);
            showStatus('success', 'Experience deleted successfully');
            fetchExperiences();
        } catch (error) {
            console.error('Failed to delete experience:', error);
            showStatus('error', 'Failed to delete experience');
        } finally {
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Manage Experience</h1>
                <Button variant="primary" onClick={() => {
                    setEditingExperience(null);
                    setIsModalOpen(true);
                }}>
                    Add Experience
                </Button>
            </div>

            <div className="grid gap-4">
                {experiences.map((exp) => (
                    <div
                        key={exp.id}
                        className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold text-[var(--color-text)]">
                                {exp.title}
                            </h3>
                            <p className="text-[var(--color-primary)]">
                                {exp.company}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                {new Date(exp.startDate).getFullYear()} -
                                {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setEditingExperience(exp);
                                    setIsModalOpen(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="secondary"
                                className="!text-red-500 hover:!text-red-600 hover:!bg-red-500/10"
                                onClick={() => handleDeleteClick(exp.id!)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}

                {experiences.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-[var(--color-text-muted)]">
                        No experience found. Add your work experience.
                    </div>
                )}
            </div>

            <ExperienceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingExperience}
                isLoading={isLoading}
            />

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Experience"
                message="Are you sure you want to delete this experience entry? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isDestructive={true}
            />

            <StatusModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                type={statusType}
                title={statusType === 'success' ? 'Success' : 'Error'}
                message={statusMessage}
            />
        </div>
    );
};
