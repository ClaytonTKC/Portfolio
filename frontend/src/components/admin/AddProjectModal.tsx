import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { contentService } from '../../services/content.service';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        liveUrl: '',
        codeUrl: '',
        tags: '',
        featured: false
    });

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
            await contentService.createProject({
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            });
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                imageUrl: '',
                liveUrl: '',
                codeUrl: '',
                tags: '',
                featured: false
            });
            alert('Project created successfully!');
        } catch (error) {
            console.error('Failed to create project:', error);
            alert('Failed to create project.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Project">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="My Awesome Project"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
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
                        {isLoading ? 'Creating...' : 'Create Project'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
