import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { contentService } from '../../services/content.service';
import type { Skill } from '../../services/content.service';
import { AddSkillModal } from '../../components/admin/AddSkillModal';

export const ManageSkills: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | undefined>(undefined);

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

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;
        try {
            await contentService.deleteSkill(id);
            setSkills(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete skill:', error);
            alert('Failed to delete skill');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSkill(undefined);
        fetchSkills(); // Refresh list after add/edit
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

            <div className="grid gap-4">
                {skills.map((skill) => (
                    <Card key={skill.id} hover={false} className="flex justify-between items-center p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded bg-[var(--color-surface)] flex items-center justify-center text-xl">
                                {skill.icon || '⚡'}
                            </div>
                            <div>
                                <h3 className="font-semibold">{skill.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                    <span>{skill.category || 'General'}</span>
                                    <span>•</span>
                                    <span>{skill.proficiency}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleEdit(skill)}>
                                Edit
                            </Button>
                            <Button variant="secondary" className="!bg-red-500/10 !text-red-500 hover:!bg-red-500/20" onClick={() => handleDelete(skill.id!)}>
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <AddSkillModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                skill={selectedSkill}
            />
        </div>
    );
};
