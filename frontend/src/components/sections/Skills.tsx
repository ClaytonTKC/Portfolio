import React from 'react';
import { useTranslation } from 'react-i18next';

const skillsData = [
    { name: 'React', icon: '⚛️', level: 90 },
    { name: 'TypeScript', icon: '📘', level: 85 },
    { name: 'Java', icon: '☕', level: 80 },
];

export const Skills: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="section" id="skills">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('skills.title')}</h2>
                    <p className="section-subtitle">{t('skills.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {skillsData.map((skill, index) => (
                        <div
                            key={skill.name}
                            className="glass-card p-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-2xl">
                                    {skill.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">{skill.name}</span>
                                        <span className="text-sm text-[var(--color-text-muted)]">
                                            {skill.level}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all duration-1000"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
