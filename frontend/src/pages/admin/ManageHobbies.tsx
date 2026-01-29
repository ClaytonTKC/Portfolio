import React, { useEffect, useState } from 'react';
import { contentService, type Hobby } from '../../services/content.service';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { StatusModal } from '../../components/ui/StatusModal';
import { HobbyModal } from '../../components/admin/HobbyModal';

export const ManageHobbies: React.FC = () => {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Status Modal State
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [statusType, setStatusType] = useState<'success' | 'error'>('success');
    const [statusMessage, setStatusMessage] = useState('');

    const fetchHobbies = React.useCallback(async () => {
        try {
            const data = await contentService.getHobbies();
            setHobbies(data);
        } catch (error) {
            console.error('Failed to fetch hobbies:', error);
            showStatus('error', 'Failed to fetch hobbies');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHobbies();
    }, [fetchHobbies]);

    const showStatus = (type: 'success' | 'error', message: string) => {
        setStatusType(type);
        setStatusMessage(message);
        setStatusModalOpen(true);
    };

    const handleSave = async (hobby: Hobby) => {
        setIsLoading(true);
        try {
            if (editingHobby?.id) {
                await contentService.updateHobby(editingHobby.id, hobby);
                showStatus('success', 'Hobby updated successfully');
            } else {
                await contentService.createHobby(hobby);
                showStatus('success', 'Hobby created successfully');
            }
            setIsModalOpen(false);
            setEditingHobby(null);
            fetchHobbies();
        } catch (error) {
            console.error('Failed to save hobby:', error);
            showStatus('error', 'Failed to save hobby');
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
            await contentService.deleteHobby(deleteId);
            showStatus('success', 'Hobby deleted successfully');
            fetchHobbies();
        } catch (error) {
            console.error('Failed to delete hobby:', error);
            showStatus('error', 'Failed to delete hobby');
        } finally {
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Manage Hobbies</h1>
                <Button variant="primary" onClick={() => {
                    setEditingHobby(null);
                    setIsModalOpen(true);
                }}>
                    Add Hobby
                </Button>
            </div>

            <div className="grid gap-4">
                {hobbies.map((hobby) => (
                    <div
                        key={hobby.id}
                        className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] flex justify-between items-center"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">{hobby.icon}</span>
                            <div>
                                <h3 className="font-semibold text-[var(--color-text)]">
                                    {hobby.name}
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    {hobby.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setEditingHobby(hobby);
                                    setIsModalOpen(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="secondary"
                                className="!text-red-500 hover:!text-red-600 hover:!bg-red-500/10"
                                onClick={() => handleDeleteClick(hobby.id!)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}

                {hobbies.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-[var(--color-text-muted)]">
                        No hobbies found. Create one to get started.
                    </div>
                )}
            </div>

            <HobbyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingHobby}
                isLoading={isLoading}
            />

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Hobby"
                message="Are you sure you want to delete this hobby? This action cannot be undone."
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
