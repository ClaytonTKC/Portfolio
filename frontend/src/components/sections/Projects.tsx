import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// Projects will be loaded from the database via admin dashboard
// const projectsData: { title: string; description: string; image: string; tags: string[]; liveUrl: string; codeUrl: string }[] = [];

import { useEffect, useState } from 'react';
import { contentService, type Project } from '../../services/content.service';

export const Projects: React.FC = () => {
    const { t } = useTranslation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await contentService.getProjects();
                // Sort by sortOrder if available
                const sortedData = data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                setProjects(sortedData);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
                setError('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section className="section bg-[var(--color-surface)]/30" id="projects">
                <div className="container mx-auto px-6 text-center">
                    <div className="animate-pulse">Loading projects...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section bg-[var(--color-surface)]/30" id="projects">
                <div className="container mx-auto px-6 text-center text-red-500">
                    {error}
                </div>
            </section>
        );
    }

    return (
        <section className="section bg-[var(--color-surface)]/30" id="projects">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('projects.title')}</h2>
                    <p className="section-subtitle">{t('projects.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card
                            key={project.id || project.title}
                            className="flex flex-col animate-fade-in-up"
                        >
                            {/* Project Image */}
                            {project.imageUrl && (
                                <div className="h-48 overflow-hidden rounded-lg mb-4 bg-[var(--color-surface)]">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-4xl">📁</span>';
                                        }}
                                    />
                                </div>
                            )}
                            {!project.imageUrl && (
                                <div className="h-48 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-light)] rounded-lg mb-4 flex items-center justify-center">
                                    <span className="text-6xl">📁</span>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                                <p className="text-[var(--color-text-muted)] text-sm mb-4">
                                    {project.description}
                                </p>

                                {/* Tags */}
                                {project.tags && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-2 py-1 rounded-md bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-[var(--glass-border)]">
                                {project.liveUrl && (
                                    <Button
                                        variant="primary"
                                        className="flex-1 text-sm py-2"
                                        onClick={() => window.open(project.liveUrl, '_blank')}
                                    >
                                        {t('projects.viewProject')}
                                    </Button>
                                )}
                                {project.codeUrl && (
                                    <Button
                                        variant="secondary"
                                        className="flex-1 text-sm py-2"
                                        onClick={() => window.open(project.codeUrl, '_blank')}
                                    >
                                        {t('projects.viewCode')}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
