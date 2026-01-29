import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contentService, type Experience as ExperienceType } from '../../services/content.service';

export const Experience: React.FC = () => {
    const { t } = useTranslation();
    const [experiences, setExperiences] = useState<ExperienceType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const data = await contentService.getExperiences();
                setExperiences(data);
            } catch (error) {
                console.error('Failed to fetch experience data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (loading) {
        return (
            <section className="section" id="experience">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[var(--color-text-muted)]">Loading experience...</p>
                </div>
            </section>
        );
    }

    if (experiences.length === 0) {
        return null; // Or render a placeholder if desired
    }

    return (
        <section className="section" id="experience">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('experience.title')}</h2>
                    <p className="section-subtitle">{t('experience.subtitle')}</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {experiences.map((exp, index) => (
                        <div
                            key={exp.id || index}
                            className="timeline-item animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <div className="glass-card p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[var(--color-text)]">
                                            {exp.title}
                                        </h3>
                                        <p className="text-[var(--color-primary)] font-medium">
                                            {exp.company}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[var(--color-text-muted)] text-sm">
                                            {exp.location}
                                        </p>
                                        <p className="text-[var(--color-secondary)] font-medium text-sm">
                                            {new Date(exp.startDate).getFullYear()} -
                                            {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                                        </p>
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    {exp.description.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 text-[var(--color-text-muted)]"
                                        >
                                            <span className="text-[var(--color-primary)] mt-1.5">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
