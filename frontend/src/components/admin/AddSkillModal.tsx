import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { contentService } from '../../services/content.service';
import type { Skill } from '../../services/content.service';
import { StatusModal } from '../ui/StatusModal';

interface AddSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    skill?: Skill;
}

export const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose, skill }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        proficiency: 50,
        category: 'Frontend',
    });
    const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: 'success' | 'error'; title: string; message: string }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    useEffect(() => {
        if (skill) {
            setFormData({
                name: skill.name,
                icon: skill.icon || '',
                proficiency: skill.proficiency,
                category: skill.category || 'Frontend',
            });
        } else {
            setFormData({
                name: '',
                icon: '',
                proficiency: 50,
                category: 'Frontend',
            });
        }
    }, [skill, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'proficiency' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (skill && skill.id) {
                await contentService.updateSkill(skill.id, { ...formData, sortOrder: skill.sortOrder || 0 });
                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Skill updated successfully!'
                });
            } else {
                await contentService.createSkill({ ...formData, sortOrder: 0 });
                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Skill created successfully!'
                });
            }
        } catch (error) {
            console.error('Failed to save skill:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save skill. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusClose = () => {
        setStatusModal(prev => ({ ...prev, isOpen: false }));
        if (statusModal.type === 'success') {
            onClose();
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={skill ? "Edit Skill" : "Add New Skill"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... form content ... */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="React, TypeScript, etc."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
                            <input
                                type="text"
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="⚡"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Proficiency ({formData.proficiency}%)</label>
                        <input
                            type="range"
                            name="proficiency"
                            min="0"
                            max="100"
                            step="5"
                            value={formData.proficiency}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (skill ? 'Update Skill' : 'Create Skill')}
                        </Button>
                    </div>
                </form>
            </Modal>
            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={handleStatusClose}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
            />
        </>
    );
};
