import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// Projects will be loaded from the database via admin dashboard
// const projectsData: { title: string; description: string; image: string; tags: string[]; liveUrl: string; codeUrl: string }[] = [];

import { useEffect, useState } from 'react';
import { contentService, type Project } from '../../services/content.service';

export const Projects: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isFrench = i18n.language === 'fr';

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

    // ... (rendering states)

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
                            {project.imageUrl && (
                                <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">
                                    {(isFrench && project.titleFr) ? project.titleFr : project.title}
                                </h3>
                                <p className="text-[var(--color-text-muted)] text-sm mb-4">
                                    {(isFrench && project.descriptionFr) ? project.descriptionFr : project.description}
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
