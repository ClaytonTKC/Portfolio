import React, { useEffect, useState } from 'react';
import { contentService, type Education } from '../../services/content.service';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { StatusModal } from '../../components/ui/StatusModal';
import { EducationModal } from '../../components/admin/EducationModal';

export const ManageEducation: React.FC = () => {
    const [education, setEducation] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Status Modal State
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [statusType, setStatusType] = useState<'success' | 'error'>('success');
    const [statusMessage, setStatusMessage] = useState('');

    const fetchEducation = React.useCallback(async () => {
        try {
            const data = await contentService.getEducation();
            setEducation(data);
        } catch (error) {
            console.error('Failed to fetch education:', error);
            showStatus('error', 'Failed to fetch education');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEducation();
    }, [fetchEducation]);

    const showStatus = (type: 'success' | 'error', message: string) => {
        setStatusType(type);
        setStatusMessage(message);
        setStatusModalOpen(true);
    };

    const handleSave = async (edu: Education) => {
        setIsLoading(true);
        try {
            if (editingEducation?.id) {
                await contentService.updateEducation(editingEducation.id, edu);
                showStatus('success', 'Education updated successfully');
            } else {
                await contentService.createEducation(edu);
                showStatus('success', 'Education created successfully');
            }
            setIsModalOpen(false);
            setEditingEducation(null);
            fetchEducation();
        } catch (error) {
            console.error('Failed to save education:', error);
            showStatus('error', 'Failed to save education');
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
            await contentService.deleteEducation(deleteId);
            showStatus('success', 'Education deleted successfully');
            fetchEducation();
        } catch (error) {
            console.error('Failed to delete education:', error);
            showStatus('error', 'Failed to delete education');
        } finally {
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Manage Education</h1>
                <Button variant="primary" onClick={() => {
                    setEditingEducation(null);
                    setIsModalOpen(true);
                }}>
                    Add Education
                </Button>
            </div>

            <div className="grid gap-4">
                {education.map((edu) => (
                    <div
                        key={edu.id}
                        className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold text-[var(--color-text)]">
                                {edu.degree}
                            </h3>
                            <p className="text-[var(--color-primary)]">
                                {edu.school}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                {new Date(edu.startDate).getFullYear()} -
                                {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setEditingEducation(edu);
                                    setIsModalOpen(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="secondary"
                                className="!text-red-500 hover:!text-red-600 hover:!bg-red-500/10"
                                onClick={() => handleDeleteClick(edu.id!)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}

                {education.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-[var(--color-text-muted)]">
                        No education history found. Add your education details.
                    </div>
                )}
            </div>

            <EducationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingEducation}
                isLoading={isLoading}
            />

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Education"
                message="Are you sure you want to delete this education entry? This action cannot be undone."
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
