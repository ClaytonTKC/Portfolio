import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { contentService } from '../../services/content.service';
import type { Project } from '../../services/content.service';
import { AddProjectModal } from '../../components/admin/AddProjectModal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { StatusModal } from '../../components/ui/StatusModal';

export const ManageProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

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

    const fetchProjects = async () => {
        try {
            const data = await contentService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleRequestDelete = (id: string) => {
        setConfirmModal({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.id) return;

        try {
            await contentService.deleteProject(confirmModal.id);
            setProjects(prev => prev.filter(p => p.id !== confirmModal.id));
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Deleted',
                message: 'Project has been successfully deleted.'
            });
        } catch (error: any) {
            console.error('Failed to delete project:', error);
            if (error.response?.status !== 401) {
                setStatusModal({
                    isOpen: true,
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to delete project. Please try again.'
                });
            }
        } finally {
            setConfirmModal({ isOpen: false, id: null });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(undefined);
        fetchProjects(); // Refresh list after add/edit
    };

    const handleStatusClose = () => {
        setStatusModal(prev => ({ ...prev, isOpen: false }));
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Projects</h2>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Add New Project
                </Button>
            </div>

            <div className="grid gap-4">
                {projects.map((project) => (
                    <Card key={project.id} hover={false} className="flex justify-between items-center p-4">
                        <div className="flex items-center gap-4">
                            {project.imageUrl && (
                                <img src={project.imageUrl} alt={project.title} className="w-16 h-16 object-cover rounded" />
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{project.title}</h3>
                                <p className="text-[var(--color-text-muted)] line-clamp-1">{project.description}</p>
                                <div className="flex gap-2 mt-1">
                                    {project.featured && (
                                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">Featured</span>
                                    )}
                                    {project.tags?.map(tag => (
                                        <span key={tag} className="text-xs bg-[var(--color-surface)] px-2 py-0.5 rounded text-[var(--color-text-muted)]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleEdit(project)}>
                                Edit
                            </Button>
                            <Button
                                variant="secondary"
                                className="!bg-red-500/10 !text-red-500 hover:!bg-red-500/20"
                                onClick={() => handleRequestDelete(project.id!)}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <AddProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                project={selectedProject}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone."
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
