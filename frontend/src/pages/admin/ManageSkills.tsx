import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { contentService } from '../../services/content.service';
import type { Skill } from '../../services/content.service';
import { AddSkillModal } from '../../components/admin/AddSkillModal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { StatusModal } from '../../components/ui/StatusModal';

export const ManageSkills: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | undefined>(undefined);
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

    const toggleCategory = (category: string) => {
        setCollapsedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    // Modal states
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });
    const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: 'success' | 'error'; title: string; message: string }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    const fetchSkills = async () => {
        try {
            const data = await contentService.getSkills();
            setSkills(data);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleEdit = (skill: Skill) => {
        setSelectedSkill(skill);
        setIsModalOpen(true);
    };

    const handleRequestDelete = (id: string) => {
        setConfirmModal({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.id) return;

        try {
            await contentService.deleteSkill(confirmModal.id);
            setSkills(prev => prev.filter(s => s.id !== confirmModal.id));
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Deleted',
                message: 'Skill has been successfully deleted.'
            });
        } catch (error: any) {
            console.error('Failed to delete skill:', error);
            if (error.response?.status !== 401) {
                setStatusModal({
                    isOpen: true,
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to delete skill. Please try again.'
                });
            }
        } finally {
            setConfirmModal({ isOpen: false, id: null });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSkill(undefined);
        fetchSkills(); // Refresh list after add/edit
    };

    const handleStatusClose = () => {
        setStatusModal(prev => ({ ...prev, isOpen: false }));
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Skills</h2>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Add New Skill
                </Button>
            </div>

            <div className="space-y-4">
                {Object.entries(
                    skills.reduce((acc, skill) => {
                        const category = skill.category || 'Other';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(skill);
                        return acc;
                    }, {} as Record<string, Skill[]>)
                ).map(([category, categorySkills]) => (
                    <div key={category} className="border border-[var(--glass-border)] rounded-lg overflow-hidden bg-[var(--glass-bg)]">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors text-left"
                        >
                            <h3 className="text-xl font-bold text-[var(--color-primary)]">{category}</h3>
                            <span className="text-2xl transform transition-transform duration-200" style={{
                                transform: collapsedCategories.has(category) ? 'rotate(-90deg)' : 'rotate(0deg)'
                            }}>
                                ▼
                            </span>
                        </button>

                        {!collapsedCategories.has(category) && (
                            <div className="p-4 grid gap-4 bg-[var(--glass-bg)]">
                                {categorySkills.map((skill) => (
                                    <Card key={skill.id} hover={false} className="flex justify-between items-center p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded bg-[var(--color-surface)] flex items-center justify-center text-xl">
                                                {skill.icon || '⚡'}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{skill.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                                    <span>{skill.category || 'General'}</span>
                                                </div>
                                                {/* Show visibility status */}
                                                {!skill.showInPortfolio && (
                                                    <span className="text-xs text-yellow-500 font-medium">
                                                        Hidden from Portfolio
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" onClick={() => handleEdit(skill)}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="!bg-red-500/10 !text-red-500 hover:!bg-red-500/20"
                                                onClick={() => handleRequestDelete(skill.id!)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AddSkillModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                skill={selectedSkill}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Skill"
                message="Are you sure you want to delete this skill? This action cannot be undone."
                confirmLabel="Delete"
                isDestructive={true}
            />

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={handleStatusClose}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
            />
        </div>
    );
};
