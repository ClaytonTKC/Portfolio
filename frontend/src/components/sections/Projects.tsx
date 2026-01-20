import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// Projects will be loaded from the database via admin dashboard
const projectsData: { title: string; description: string; image: string; tags: string[]; liveUrl: string; codeUrl: string }[] = [];

export const Projects: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="section bg-[var(--color-surface)]/30" id="projects">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('projects.title')}</h2>
                    <p className="section-subtitle">{t('projects.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectsData.map((project) => (
                        <Card
                            key={project.title}
                            className="flex flex-col animate-fade-in-up"
                        >
                            {/* Project Image */}
                            <div className="h-48 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-light)] rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-6xl">{project.image}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                                <p className="text-[var(--color-text-muted)] text-sm mb-4">
                                    {project.description}
                                </p>

                                {/* Tags */}
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
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-[var(--glass-border)]">
                                <Button variant="primary" className="flex-1 text-sm py-2">
                                    {t('projects.viewProject')}
                                </Button>
                                <Button variant="secondary" className="flex-1 text-sm py-2">
                                    {t('projects.viewCode')}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
