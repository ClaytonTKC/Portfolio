import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { contentService } from '../../services/content.service';
import type { Project } from '../../services/content.service';
import { StatusModal } from '../ui/StatusModal';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project?: Project;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, project }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        titleFr: '',
        description: '',
        descriptionFr: '',
        imageUrl: '',
        liveUrl: '',
        codeUrl: '',
        tags: '',
        featured: false
    });
    const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: 'success' | 'error'; title: string; message: string }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                titleFr: project.titleFr || '',
                description: project.description,
                descriptionFr: project.descriptionFr || '',
                imageUrl: project.imageUrl || '',
                liveUrl: project.liveUrl || '',
                codeUrl: project.codeUrl || '',
                tags: project.tags ? project.tags.join(', ') : '',
                featured: project.featured || false
            });
        } else {
            setFormData({
                title: '',
                titleFr: '',
                description: '',
                descriptionFr: '',
                imageUrl: '',
                liveUrl: '',
                codeUrl: '',
                tags: '',
                featured: false
            });
        }
    }, [project, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const projectData: Project = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                sortOrder: project?.sortOrder || 0
            };

            if (project && project.id) {
                await contentService.updateProject(project.id, projectData);
                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Project updated successfully!'
                });
            } else {
                await contentService.createProject(projectData);
                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Project created successfully!'
                });
            }
        } catch (error) {
            console.error('Failed to save project:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save project. Please try again.'
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
            <Modal isOpen={isOpen} onClose={onClose} title={project ? "Edit Project" : "Add New Project"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title (English)</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="My Project"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title (French)</label>
                            <input
                                type="text"
                                name="titleFr"
                                value={formData.titleFr}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Mon Projet"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description (English)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="form-input"
                            placeholder="Project description..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description (French)</label>
                        <textarea
                            name="descriptionFr"
                            value={formData.descriptionFr}
                            onChange={handleChange}
                            rows={3}
                            className="form-input"
                            placeholder="Description du projet..."
                        />
                    </div>

                    {/* ... (rest of the form remains unchanged) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Live URL</label>
                            <input
                                type="url"
                                name="liveUrl"
                                value={formData.liveUrl}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://mysite.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Code URL</label>
                            <input
                                type="url"
                                name="codeUrl"
                                value={formData.codeUrl}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="React, TypeScript, Node.js"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleCheckboxChange}
                            className="rounded border-[var(--glass-border)] bg-[var(--color-surface)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <label htmlFor="featured">Feature this project</label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
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
