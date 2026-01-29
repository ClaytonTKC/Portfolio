import React from 'react';
import { useTranslation } from 'react-i18next';

// const skillsData = [
//     { name: 'React', icon: '⚛️', level: 90 },
//     { name: 'TypeScript', icon: '📘', level: 85 },
//     { name: 'Java', icon: '☕', level: 80 },
// ];

import { useEffect, useState } from 'react';
import { contentService, type Skill } from '../../services/content.service';

export const Skills: React.FC = () => {
    const { t } = useTranslation();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await contentService.getSkills();
                // Sort by sortOrder
                const sortedData = data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                setSkills(sortedData);
            } catch (err) {
                console.error('Failed to fetch skills:', err);
                setError('Failed to load skills');
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    if (loading) {
        return (
            <section className="section" id="skills">
                <div className="container mx-auto px-6 text-center">
                    <div className="animate-pulse">Loading skills...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section" id="skills">
                <div className="container mx-auto px-6 text-center text-red-500">
                    {error}
                </div>
            </section>
        );
    }

    return (
        <section className="section" id="skills">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('skills.title')}</h2>
                    <p className="section-subtitle">{t('skills.subtitle')}</p>
                </div>

                <div className="max-w-4xl mx-auto space-y-12">
                    {Object.entries(
                        skills.reduce((acc, skill) => {
                            const category = skill.category || 'Other';
                            if (!acc[category]) acc[category] = [];
                            acc[category].push(skill);
                            return acc;
                        }, {} as Record<string, Skill[]>)
                    ).map(([category, categorySkills]) => (
                        <div key={category} className="animate-fade-in-up">
                            <h3 className="text-2xl font-bold mb-6 text-center md:text-left text-[var(--color-primary)]">
                                {category}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {categorySkills.map((skill) => (
                                    <div
                                        key={skill.id || skill.name}
                                        className="glass-card p-4 hover:bg-[var(--color-surface-hover)] transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-2xl">
                                                {skill.icon || '🔹'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{skill.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
};
