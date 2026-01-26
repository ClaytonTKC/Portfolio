import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StatusModal } from '../ui/StatusModal';
import { contentService } from '../../services/content.service';

interface AddSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: 'success' | 'error'; title: string; message: string }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend',
        proficiency: 50,
        icon: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const closeStatusModal = () => {
        setStatusModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await contentService.createSkill({
                ...formData,
                proficiency: Number(formData.proficiency)
            });
            onClose();
            // Reset form
            setFormData({
                name: '',
                category: 'Frontend',
                proficiency: 50,
                icon: ''
            });
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Success!',
                message: 'Skill created successfully.'
            });
        } catch (error) {
            console.error('Failed to create skill:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to create skill. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Add New Skill">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Skill Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="React, Golang, Docker..."
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
                            <option value="Tools">Tools</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Proficiency ({formData.proficiency}%)</label>
                        <input
                            type="range"
                            name="proficiency"
                            min="0"
                            max="100"
                            value={formData.proficiency}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Icon (Emoji or URL)</label>
                        <input
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="⚛️"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Skill'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={closeStatusModal}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
            />
        </>
    );
};
