import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { contentService } from '../../services/content.service';
import type { Project } from '../../services/content.service';
import { AddProjectModal } from '../../components/admin/AddProjectModal';

export const ManageProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

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

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await contentService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Failed to delete project');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(undefined);
        fetchProjects(); // Refresh list after add/edit
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
                            <Button variant="secondary" className="!bg-red-500/10 !text-red-500 hover:!bg-red-500/20" onClick={() => handleDelete(project.id!)}>
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
        </div>
    );
};
